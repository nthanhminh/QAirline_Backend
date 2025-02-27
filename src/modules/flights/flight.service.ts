import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Flight } from "./entity/flight.entity";
import { FlightRepository } from "@repositories/flight.repository";
import { CreateNewFlightDto } from "./dto/createNewFlight.dto";
import { UpdateFlightDto } from "./dto/updateNewFight.dto";
import { DataSource, ObjectLiteral, QueryRunner, UpdateResult } from "typeorm";
import { FilterFlightDto } from "./dto/findFlight.dto";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";
import { EFlightStatus, ESortFlightByDeparture, ESortFlightByPrice } from "./enums/index.enum";
import { convertNowToTimezone, durationToSeconds } from "src/helper/time.helper";
import { AirportService } from "@modules/airports/airport.service";
import { PlaneService } from "@modules/planes/planes.service";
import * as moment from "moment";
import { NumberOfSeatsForFlight, SeatClassPrice } from "./type/index.type";
import { FlightPrice } from "@modules/priceForFlight/entity/priceForFlight.entity";
import { ETimeZone } from "src/common/enum/index.enum";
import { FindAllResponse } from "src/types/common.type";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { EBookingStatus } from "@modules/booking/enums/index.enum";
import { SeatService } from "@modules/seatsForPlaneType/seats.service";

@Injectable()
export class FlightService extends BaseServiceAbstract<Flight> {
    constructor(
        @Inject('FLIGHT_REPOSITORY')
        private readonly flightRepository:FlightRepository,

        @Inject('DATA_SOURCE') 
        private readonly dataSource: DataSource,

        private readonly airportService: AirportService,

        @Inject(forwardRef(() => PlaneService))
        private readonly planeService: PlaneService,
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
  
      let { departureTime, duration, fromAirportId, toAirportId, planeId, ...data } = dto;
      const plane = planeId ? await this.planeService.findOneByCondition({id: planeId}) : null;
      if(planeId && !plane) {
          throw new NotFoundException('planes.plane not found');
      }
      const currentDepartureTime = moment(flight.departureTime);
      const convertedDepartureTime = moment(departureTime, 'DD-MM-YYYY HH:mm:ss').toDate();
      if(currentDepartureTime.isBefore(convertedDepartureTime)) {
        const now = moment();
        const diff = now.diff(currentDepartureTime, 'hours');
        if(diff >= -3) {
          data["status"] = EFlightStatus.DELAYED;
        }
      }
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

    async filterFlight(dto: FilterFlightDto) : Promise<FindAllResponse<ObjectLiteral>> {
        const { search, status, fromAiportId, toAiportId, departureTime, sortedByPrice, sortedByDeparture, page, pageSize } = dto;
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

        if (status) {
            queryBuilder.andWhere("flight.status = :status", { status });
        }

        if (departureTime) {
          const startOfDay = moment(departureTime, "DD-MM-YYYY").startOf('day').toDate();
          const endOfDay = moment(departureTime, "DD-MM-YYYY").endOf('day').toDate();
          queryBuilder.andWhere("flight.departureTime BETWEEN :startOfDay AND :endOfDay", {
            startOfDay,
            endOfDay,
          });
        }
        
        if(sortedByPrice) {
          if(sortedByPrice === ESortFlightByPrice.ASC_PRICE) {
            queryBuilder.addOrderBy("min_price", "ASC"); 
          } else {
            queryBuilder.addOrderBy("min_price", "DESC"); 
          }
        }

        if(sortedByDeparture) {
          if(sortedByDeparture === ESortFlightByDeparture.DESC_DEPARTURE_TIME) {
            queryBuilder.addOrderBy("flight.departureTime", "DESC");
          } else {
            queryBuilder.addOrderBy("flight.departureTime", "ASC");
          }
        }
        queryBuilder.skip(skip).take(limit);
        const [flights, cnt] = await queryBuilder.getManyAndCount();
        return {
          count: cnt,
          items: flights
        };
    }

    async getFlightWithDetailInfo(flightId: string) : Promise<Flight> {
        const flight = await this.dataSource
          .getRepository(Flight) 
          .createQueryBuilder("flight")
          .leftJoinAndSelect("flight.flightsPrice", "flights_price")
          .leftJoinAndSelect("flights_price.seatClassInfo", "flights_price_seatClassInfo") 
          .leftJoinAndSelect("flight.plane", "flight_plane") 
          .leftJoinAndSelect("flight_plane.seatLayoutId", "flight_plane_seatlayout") 
          .leftJoinAndSelect("flight.fromAirport", "flight_from_airport")
          .leftJoinAndSelect("flight.toAirport", "flight_to_airport") 
          .leftJoinAndSelect("flight_to_airport.discounts", "flight_to_airport_discounts")
          .leftJoinAndSelect("flight.bookings", "flight_bookings")
          .leftJoinAndSelect(
            "flight_bookings.tickets", 
            "flight_bookings_tickets", 
            "flight_bookings_tickets.status = :activeStatus", 
            { activeStatus: EBookingStatus.ACTIVE }
          )
          .where("flight.id = :flightId", { flightId })
          .getOne(); 
        if(!flight) {
          return null;
        }
        return flight;
    }

    async getAllFlightWithDetailInfo(dto: PaginationDto) : Promise<FindAllResponse<Flight>> {
      const {page, pageSize} = dto;
      const {skip, limit} = _getSkipLimit({page, pageSize});
      const [flights, count] = await this.dataSource
        .getRepository(Flight) 
        .createQueryBuilder("flight")
        .leftJoinAndSelect("flight.flightsPrice", "flights_price")
        .leftJoinAndSelect("flights_price.seatClassInfo", "flights_price_seatClassInfo") 
        .leftJoinAndSelect("flight.plane", "flight_plane") 
        .leftJoinAndSelect("flight_plane.seatLayoutId", "flight_plane_seatlayout") 
        .leftJoinAndSelect("flight.fromAirport", "flight_from_airport")
        .leftJoinAndSelect("flight.toAirport", "flight_to_airport") 
        .leftJoinAndSelect("flight_to_airport.discounts", "flight_to_airport_discounts")
        .leftJoinAndSelect("flight.bookings", "flight_bookings")
        .leftJoinAndSelect(
          "flight_bookings.tickets", 
          "flight_bookings_tickets", 
          "flight_bookings_tickets.status = :activeStatus", 
          { activeStatus: EBookingStatus.ACTIVE }
        )
        .orderBy('flight.createdAt', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount(); 
      return {
        items: flights,
        count: count
      };
  }

    async getSeatClassPriceForFlight(flightId: string) : Promise<SeatClassPrice[]> {
      const flight = await this.dataSource
          .getRepository(Flight) 
          .createQueryBuilder("flight")
          .leftJoinAndSelect("flight.flightsPrice", "flights_price")
          .leftJoinAndSelect("flights_price.seatClassInfo", "flights_price_seatClassInfo")
          .where("flight.id = :flightId", { flightId }) 
          .getOne();
      const seatClassPrices = flight.flightsPrice.map((flightPrice) => {
        return {
          name: flightPrice.seatClassInfo.name,
          price: flightPrice.price
        }
      })
      return seatClassPrices;
    }

    getSeatClassPriceForFlightUsingFlightsPrice(flightsPrice: FlightPrice[]) : SeatClassPrice[] {
      const seatClassPrices = flightsPrice.map((flightPrice) => {
        return {
          name: flightPrice.seatClassInfo.name,
          price: flightPrice.price
        }
      })
      return seatClassPrices;
    }

    async getNumberOfSeatInfoForFlight(id: string, queryRunner: QueryRunner): Promise<NumberOfSeatsForFlight> {
      const flight = await queryRunner.manager
            .createQueryBuilder('flight', 'flight')
            .leftJoin('flight.plane', 'flight_plane')
            .leftJoin('flight_plane.seatLayoutId', 'flight_plane_seatLayout')
            .where('flight.id = :flightId', { flightId: id })
            .select([
              'flight_plane_seatLayout.numberOfBusinessSeats AS numberOfBusinessSeats', 
              'flight_plane_seatLayout.numberOfPreminumEconomySeats AS numberOfPreminumEconomySeats',
              'flight_plane_seatLayout.numberOfEconomySeats AS numberOfEconomySeats',
              'flight_plane_seatLayout.numberOfBasicSeats AS numberOfBasicSeats',
            ])
            .getRawOne();
      return {
        numberOfBasicSeats: flight["numberofbasicseats"],
        numberOfBusinessSeats: flight["numberofbusinessseats"],
        numberOfEconomySeats: flight["numberofbusinessseats"],
        numberOfPreminumEconomySeats: flight["numberofpreminumeconomyseats"]
      };
    }    
}