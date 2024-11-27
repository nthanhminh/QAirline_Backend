import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Flight } from "./entity/flight.entity";
import { FlightRepository } from "@repositories/flight.repository";
import { CreateNewFlightDto } from "./dto/createNewFlight.dto";
import { UpdateFlightDto } from "./dto/updateNewFight.dto";
import { DataSource, ObjectLiteral, UpdateResult } from "typeorm";
import { FilterFlightDto } from "./dto/findFlight.dto";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";
import { ESortFlightBy } from "./enums/index.enum";
import { durationToSeconds } from "src/helper/time.helper";
import { AirportService } from "@modules/airports/airport.service";
import { PlaneService } from "@modules/planes/planes.service";
import * as moment from "moment";

@Injectable()
export class FlightService extends BaseServiceAbstract<Flight> {
    constructor(
        @Inject('FLIGHT_REPOSITORY')
        private readonly flightRepository:FlightRepository,

        @Inject('DATA_SOURCE') 
        private readonly dataSource: DataSource,

        private readonly airportService: AirportService,

        private readonly planeService: PlaneService
    ) {
        super(flightRepository)
    }

    async createNewFlight(dto: CreateNewFlightDto): Promise<Flight> {
        const { departureTime, duration, fromAirportId, toAirportId, planeId, ...data } = dto;
        const plane = await this.planeService.findOneByCondition({id: planeId});
        if(!plane) {
          throw new NotFoundException('planes.plane not found');
        }
        const convertedDuration = durationToSeconds(duration);
        const convertedDepartureTime = moment(departureTime, 'DD-MM-YYYY HH:mm:ss').toDate();
        const [fromAirport, toAirport] = await Promise.all([
            this.airportService.findOneByCondition({id: fromAirportId}),
            this.airportService.findOneByCondition({id: toAirportId}),
        ])
        if(!fromAirport || !toAirport) {
          throw new NotFoundException('flights.not found fromAirport or toAirport');
        }
        return await this.flightRepository.create({
            ...data,
            departureTime: convertedDepartureTime,
            duration: convertedDuration,
            fromAirport: fromAirport,
            toAirport: toAirport,
            plane: plane
        });
    }

    async updateFlight(id: string, dto: UpdateFlightDto): Promise<UpdateResult> {
      const flight = await this.flightRepository.findOneById(id);
      if (!flight) {
          throw new NotFoundException('Flight not found');
      }
  
      const { departureTime, duration, fromAirportId, toAirportId, planeId, ...data } = dto;
      const plane = planeId ? await this.planeService.findOneByCondition({id: planeId}) : null;
      if(planeId && !plane) {
          throw new NotFoundException('planes.plane not found');
      }
      const convertedDepartureTime = departureTime ? new Date(departureTime) : undefined;
      const convertedDuration = duration ? durationToSeconds(duration) : undefined;
  
      const [fromAirport, toAirport] = await Promise.all([
          fromAirportId ? this.airportService.findOneByCondition({ id: fromAirportId }) : null,
          toAirportId ? this.airportService.findOneByCondition({ id: toAirportId }) : null,
      ]);
  
      if ((fromAirportId && !fromAirport) || (toAirportId && !toAirport)) {
          throw new NotFoundException('Either fromAirport or toAirport not found');
      }
  
      const updatePayload = {
          ...data,
          ...(convertedDepartureTime && { departureTime: convertedDepartureTime }),
          ...(convertedDuration && { duration: convertedDuration }),
          ...(fromAirport && { fromAirport }),
          ...(toAirport && { toAirport }),
          ...(plane && { plane }),
      };
  
      if (Object.keys(updatePayload).length === 0) {
          throw new BadRequestException('No changes to update');
      }
  
      return this.flightRepository.update(id, updatePayload);
    }  

    async deleteFlight(id: string) : Promise<UpdateResult> {
        return await this.flightRepository.softDelete(id);
    }

    async filterFlight(dto: FilterFlightDto) : Promise<ObjectLiteral[]> {
        const { search, fromAiportId, toAiportId, departureTime, sortedBy, page, pageSize } = dto;
        const { skip, limit } = _getSkipLimit({ page, pageSize });
    
        const condition: any = {};
        if (search) {
          condition["flightCode"] = search;
        }

        const queryBuilder = this.dataSource.getRepository("flight")
            .createQueryBuilder("flight")
            .leftJoinAndSelect('flight.fromAirport', 'flight_fromAirport')
            .leftJoinAndSelect("flight.toAirport", "flight_toAirport")
            .leftJoinAndSelect("flight.plane", "flight_plane")
            .leftJoinAndSelect("flight_plane.seatLayoutId", "flight_plane_seatlayout")
            .leftJoinAndSelect("flight.flightsPrice", "flight_price")
            .leftJoinAndSelect("flight_price.seatClassInfo", "seat_class_info")
            .addSelect(subQuery => {
              return subQuery
                .select("MIN(flight_price.price)", "min_price")
                .from("flight_price", "flight_price")
                .where("flight_price.flightId = flight.id");
            }, "min_price")  
            .groupBy("flight.id, flight_fromAirport.id, flight_toAirport.id, flight_plane.id, flight_plane_seatlayout.id, flight_price.id, seat_class_info.id") 
        if (search) {
          queryBuilder.andWhere("flight.flightCode = :search", { search });
        }

        if (fromAiportId) {
          queryBuilder.andWhere("flight_fromAirport.id = :fromAiportId", { fromAiportId });
        }
        
        if (toAiportId) {
          queryBuilder.andWhere("flight_toAirport.id = :toAiportId", { toAiportId });
        }

        if (departureTime) {
          const startOfDay = moment(departureTime, "DD-MM-YYYY").startOf('day').toDate();
          const endOfDay = moment(departureTime, "DD-MM-YYYY").endOf('day').toDate();
          console.log(startOfDay, endOfDay);
          queryBuilder.andWhere("flight.departureTime BETWEEN :startOfDay AND :endOfDay", {
            startOfDay,
            endOfDay,
          });
        }
        
        switch (sortedBy) {
          case ESortFlightBy.ASC_DEPARTURE_TIME:
            queryBuilder.orderBy("flight.departureTime", "ASC");
            break;
          case ESortFlightBy.DESC_DEPARTURE_TIME:
            queryBuilder.orderBy("flight.departureTime", "DESC");
            break;
          case ESortFlightBy.ASC_DURATION:
            queryBuilder.orderBy("flight.duration", "ASC");
            break;
          case ESortFlightBy.DESC_DURATION:
            queryBuilder.orderBy("flight.duration", "DESC");
            break;
          case ESortFlightBy.ASC_PRICE:
            queryBuilder.orderBy("min_price", "ASC"); 
            break;
          case ESortFlightBy.DESC_PRICE:
            queryBuilder.orderBy("min_price", "DESC"); 
            break;
          default:
            queryBuilder.orderBy("flight.departureTime", "ASC");
        }

        queryBuilder.skip(skip).take(limit);
    
        const [flights, cnt] = await queryBuilder.getManyAndCount();
        console.log(cnt);
        return flights;
    }

    async getFlightWithDetailInfo(flightId: string) : Promise<Flight> {
        const flight = this.dataSource
          .getRepository(Flight) 
          .createQueryBuilder("flight") 
          .leftJoinAndSelect("flight.plane", "flight_plane") 
          .leftJoinAndSelect("flight_plane.seatLayoutId", "flight_plane_seatlayout") 
          .where("flight.id = :flightId", { flightId }) 
          .getOne(); 
    
        return flight;
    }
}