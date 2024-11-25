import { Inject, Injectable } from "@nestjs/common";
import { AirportRepository } from "@repositories/airport.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Airport } from "./entity/airport.entity";
import { DeepPartial, IsNull, Like, UpdateResult } from "typeorm";
import { CreateNewAirportDto } from "./dto/createNewAiport.dto";
import { UpdateAirportDto } from "./dto/updateAirport.dto";
import { FindAllResponse } from "src/types/common.type";
import { FindAirportDto } from "./dto/findAirport.dto";
import { take } from "rxjs";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";

@Injectable()
export class AirportService extends BaseServiceAbstract<Airport> {
    constructor(
        @Inject('AIRPORT_REPOSITORY')
        private readonly airportRepository: AirportRepository,
      ) {
        super(airportRepository);
    }

    async createAirport(dto: CreateNewAirportDto): Promise<Airport> {
        return await this.airportRepository.create(dto);
    }

    async updateAirport(id: string, dto: UpdateAirportDto): Promise<UpdateResult> {
        return await this.airportRepository.update(id, dto);
    }

    async deleteAirport(id: string): Promise<UpdateResult> {
        return await this.airportRepository.softDelete(id);
    }

    async findAirport(dto: FindAirportDto): Promise<FindAllResponse<Airport>> {
        const { code, location, search, page, pageSize } = dto;
        const { skip, limit} = _getSkipLimit({page, pageSize});
        const condition = {
            ...(code ? { code: Like(`%${code}%`) } : {}),
            ...(search ? { name: Like(`%${name}%`) } : {}),
            ...(location ? { location: Like(`%${location}%`) } : {}),
        };
        return await this.airportRepository.findAll(
            condition,
            {
               take: limit,
               skip: skip,
            }
        );
    }
}