import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Flight } from '@modules/flights/entity/flight.entity';

export class FlightRepository extends BaseRepositoryAbstract<Flight> {
  constructor(dataSource: DataSource) {
    super(Flight, dataSource); 
  }
}
