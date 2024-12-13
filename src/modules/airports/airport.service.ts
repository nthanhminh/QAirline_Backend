import { Inject, Injectable } from "@nestjs/common";
import { AirportRepository } from "@repositories/airport.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Airport } from "./entity/airport.entity";
import { DataSource, DeepPartial, IsNull, Like, UpdateResult } from "typeorm";
import { CreateNewAirportDto } from "./dto/createNewAiport.dto";
import { UpdateAirportDto } from "./dto/updateAirport.dto";
import { FindAllResponse } from "src/types/common.type";
import { FindAirportDto } from "./dto/findAirport.dto";
import { take } from "rxjs";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";
import { response } from "express";

@Injectable()
export class AirportService extends BaseServiceAbstract<Airport> {
    constructor(
        @Inject('AIRPORT_REPOSITORY')
        private readonly airportRepository: AirportRepository,

        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource
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
        const queryBuilder = this.dataSource.getRepository(Airport).createQueryBuilder('airport');

        if (search) {
            queryBuilder.orWhere('LOWER(airport.code) LIKE LOWER(:search)', { search: `%${search}%` });
            queryBuilder.orWhere('LOWER(airport.name) LIKE LOWER(:search)', { search: `%${search}%` });
            queryBuilder.orWhere('LOWER(airport.location) LIKE LOWER(:search)', { search: `%${search}%` });
        }
        
        if (location) {
            queryBuilder.andWhere('LOWER(airport.location) LIKE LOWER(:location)', { location: `%${location}%` });
        }
        
        if (code) {
            queryBuilder.andWhere('LOWER(airport.code) LIKE LOWER(:code)', { code: `%${code}%` });
        }
          
        queryBuilder.skip(skip).limit(limit);

        const [airports, count] = await queryBuilder.getManyAndCount();

        return {
            count: count,
            items: airports
        }
    }

    async getAllAirportByRegion(): Promise<{ type: string; items: Airport[] }[]> {
        const airports = (await this.airportRepository.findAll({})).items;
    
        const groupedAirports = airports.reduce((result, airport) => {
            const region = airport.region;  
    
            if (!result[region]) {
                result[region] = [];
            }
    
            result[region].push(airport);  
            return result;
        }, {} as { [region: string]: Airport[] });
    
        
        return Object.entries(groupedAirports).map(([region, airportsInRegion]) => ({
            type: region,       
            items: airportsInRegion,  
        }));
    }         
}