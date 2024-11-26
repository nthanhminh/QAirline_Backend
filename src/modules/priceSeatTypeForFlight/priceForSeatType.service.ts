import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { PriceForSeatType } from "./entity/priceForSeatType.entity";
import { PriceForSeatTypeRepository } from "@repositories/priceForSeatType.repository";
import { CreateNewPriceForSeatTypeDto } from "./dto/createNewPriceForSeatType.dto";
import { FlightService } from "@modules/flights/flight.service";
import { UpdatePriceForSeatTypeDto } from "./dto/updatePriceForSeatType.dto";
import { UpdateResult } from "typeorm";
import { FindAllResponse } from "src/types/common.type";

@Injectable()
export class PriceForSeatTypeService extends BaseServiceAbstract<PriceForSeatType> {
    constructor(
        @Inject('PRICE_FOR_SEAT_TYPE_REPOSITORY')
        private readonly priceForSeatTypeRepository: PriceForSeatTypeRepository,
        private readonly flightService: FlightService 
    ) {
        super(priceForSeatTypeRepository)
    }

    async createNewPriceForSeatType(dto: CreateNewPriceForSeatTypeDto): Promise<PriceForSeatType> {
        const { flightId, ...data } = dto;
        const flight = await this.flightService.findOneByCondition({id: flightId});
        if(!flight) {
            throw new NotFoundException('flights.flight not found');
        }
        return await this.priceForSeatTypeRepository.create({
            ...data,
            flight: flight,
        });
    }

    async updatePriceForSeatType(id: string, dto: UpdatePriceForSeatTypeDto) : Promise<UpdateResult> {
        const { flightId, ...data } = dto;
        const flight = await this.flightService.findOneByCondition({id: flightId});
        if(!flight) {
            throw new NotFoundException('flights.flight not found');
        }
        return await this.priceForSeatTypeRepository.update(id, {
            ...data,
            flight: flight,
        });
    }

    async findAllPriceForFlight(flightId: string) : Promise<FindAllResponse<PriceForSeatType>> {
        const condition = {
          flight: { id: flightId },
        };
      
        const options = {
          relations: ['flight'],  
        };
      
        return await this.findAll(condition, options);
    }  

    async deletePriceForSeatType(id: string) : Promise<UpdateResult> {
        return await this.priceForSeatTypeRepository.softDelete(id);
    }
}