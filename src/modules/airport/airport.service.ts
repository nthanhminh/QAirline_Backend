import { Inject, Injectable } from '@nestjs/common';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { Airport } from './entity/airport.entity';
import { AirportRepository } from '@repositories/airport.repository';
import { Any } from 'typeorm';
import { FindOptionsWhere, UpdateResult, DeleteResult } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';

@Injectable()
export class AirportService extends BaseServiceAbstract<Airport>{
  constructor(
    @Inject('AIRPORT_REPOSITORY')
    private readonly airportRepository: AirportRepository,
  ) {
    super(airportRepository);
  }

  async create(createAirportDto: CreateAirportDto): Promise<Airport> {
      return await this.airportRepository.create({
        ...createAirportDto,
      });
  }

  async findAll(
    filter?: FindOptionsWhere<Airport>,
    options?: object,
  ): Promise<FindAllResponse<Airport>>  {
    return await this.airportRepository.findAll(filter, options);
  }

  async findOne(code: string): Promise<Airport | null> {
    return await this.airportRepository.findOneByCondition({code})
  }

  async searchByCode(code: string): Promise<Airport[]> { 
    return [];
  }

  // update(id: number, updateAirportDto: UpdateAirportDto) {
  //   return `This action updates a #${id} airport`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} airport`;
  // }
}
