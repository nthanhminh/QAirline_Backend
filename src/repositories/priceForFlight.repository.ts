import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { FlightPrice } from '@modules/priceForFlight/entity/priceForFlight.entity';

export class FlightPriceRepository extends BaseRepositoryAbstract<FlightPrice> {
  constructor(dataSource: DataSource) {
    super(FlightPrice, dataSource); 
  }
}
