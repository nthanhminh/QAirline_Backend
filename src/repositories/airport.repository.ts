import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Airport } from '@modules/airports/entity/airport.entity';


export class AirportRepository extends BaseRepositoryAbstract<Airport> {
  constructor(dataSource: DataSource) {
    super(Airport, dataSource); 
  }
}
