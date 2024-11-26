import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { PriceForSeatType } from '@modules/priceSeatTypeForFlight/entity/priceForSeatType.entity';

export class PriceForSeatTypeRepository extends BaseRepositoryAbstract<PriceForSeatType> {
  constructor(dataSource: DataSource) {
    super(PriceForSeatType, dataSource); 
  }
}
