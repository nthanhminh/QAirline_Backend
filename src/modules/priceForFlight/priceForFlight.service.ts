import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { FlightPrice } from "./entity/priceForFlight.entity";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FlightPriceRepository } from "@repositories/priceForFlight.repository";
import { CreateNewPriceForFlightDto } from "./dto/createNewPriceForFlight.dto";
import { FlightService } from "@modules/flights/flight.service";
import { SeatClassInfoService } from "@modules/seatClassInfo/seatClassInfo.service";
import { UpdatePriceForFlightDto } from "./dto/updatePriceForFlight.dto";
import { UpdateResult } from "typeorm";
import { FindAllResponse } from "src/types/common.type";

@Injectable()
export class PriceFlightService extends BaseServiceAbstract<FlightPrice> {
    constructor(
        @Inject('PRICE_FOR_FLIGHT_REPOSITORY')
        private readonly flightPriceRepository:FlightPriceRepository,
        private readonly fligthService: FlightService,
        private readonly seatClassInfoService: SeatClassInfoService
    ) {
        super(flightPriceRepository)
    }

    async createNewFlightPrice(dto: CreateNewPriceForFlightDto) : Promise<FlightPrice> {
        const { flightId, seatClassInfoId, ...data } = dto;
        const flight = await this.fligthService.findOneByCondition({id: flightId});
        if (!flight) {
            throw new NotFoundException('flights.flight not found');
        }
        const seatClassInfo = await this.seatClassInfoService.findOneByCondition({id: seatClassInfoId});
        if (!seatClassInfo) {
            throw new NotFoundException('seats.seat class not found');
        }
        return await this.flightPriceRepository.create({
            ...data,
            flight: flight,
            seatClassInfo: seatClassInfo
        })
    }

    async updateFlightPrice(id: string, dto: UpdatePriceForFlightDto) : Promise<UpdateResult> {
        const { flightId, seatClassInfoId, ...data } = dto;
        const flight = await this.fligthService.findOneByCondition({id: flightId});
        if (!flight) {
            throw new NotFoundException('flights.flight not found');
        }
        const seatClassInfo = await this.seatClassInfoService.findOneByCondition({id: seatClassInfoId});
        if (!seatClassInfo) {
            throw new NotFoundException('seats.seat class not found');
        }
        return await this.flightPriceRepository.update(id, {
            ...data,
            flight: flight,
            seatClassInfo: seatClassInfo
        })
    }

    async deleteFlightPrice(id: string) : Promise<UpdateResult> {
        return await this.flightPriceRepository.softDelete(id);
    }

    async findAllPriceForFlight(flightId: string) : Promise<FindAllResponse<FlightPrice>> {
        const condition = {
          flight: { id: flightId },
        };
      
        const options = {
          relations: ['flight'],  
        };
      
        return await this.findAll(condition, options);
    }  
}