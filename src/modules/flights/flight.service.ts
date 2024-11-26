import { Inject, Injectable, NotFoundException } from "@nestjs/common";
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

@Injectable()
export class FlightService extends BaseServiceAbstract<Flight> {
    constructor(
        @Inject('FLIGHT_REPOSITORY')
        private readonly flightRepository:FlightRepository,

        @Inject('DATA_SOURCE') 
        private readonly dataSource: DataSource
    ) {
        super(flightRepository)
    }

    async createNewFlight(dto: CreateNewFlightDto): Promise<Flight> {
        const { departureTime, duration, ...data } = dto;
        const convertedDuration = durationToSeconds(duration);
        const convertedDepartureTime = new Date(departureTime);
        return await this.flightRepository.create({
            ...data,
            departureTime: convertedDepartureTime,
            duration: convertedDuration
        });
    }

    async updateFlight(id: string, dto: UpdateFlightDto) : Promise<UpdateResult> {
        const flight = await this.flightRepository.findOneById(id);
        if(!flight) {
            throw new NotFoundException('flights.flight not found');
        }
        const { departureTime, duration, ...data } = dto;
        const convertedDepartureTime = new Date(departureTime);
        const convertedDuration = durationToSeconds(duration);
        return await this.flightRepository.update(id, {
            ...data,
            departureTime: convertedDepartureTime,
            duration: convertedDuration
        });
    }

    async deleteFlight(id: string) : Promise<UpdateResult> {
        return await this.flightRepository.softDelete(id);
    }

    async filterFlight(dto: FilterFlightDto) : Promise<ObjectLiteral[]> {
        const { search, sortedBy, page, pageSize } = dto;
        const { skip, limit } = _getSkipLimit({ page, pageSize });
    
        const condition: any = {};
        if (search) {
          condition["flightCode"] = search;
        }

        const queryBuilder = this.dataSource.getRepository("flight")
            .createQueryBuilder("flight")
            .leftJoin("flight.flightsPrice", "flight_price")
            .addSelect(subQuery => {
              return subQuery
                .select("MIN(flight_price.price)", "min_price")
                .from("flight_price", "flight_price")
                .where("flight_price.flightId = flight.id");
            }, "min_price")  
            .groupBy("flight.id") 
        if (search) {
          queryBuilder.andWhere("flight.flightCode = :search", { search });
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
            queryBuilder.orderBy("min_price", "ASC"); // Order by the minimum price
            break;
          case ESortFlightBy.DESC_PRICE:
            queryBuilder.orderBy("min_price", "DESC"); // Order by the minimum price
            break;
          default:
            queryBuilder.orderBy("flight.departureTime", "ASC");
        }

        queryBuilder.skip(skip).take(limit);
    
        const flights = await queryBuilder.getRawMany();
    
        return flights;
    }
}