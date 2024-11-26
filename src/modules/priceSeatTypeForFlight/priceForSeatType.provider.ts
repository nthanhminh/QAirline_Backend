import { DataSource } from 'typeorm';
import { PriceForSeatTypeRepository } from '@repositories/priceForSeatType.repository';

export const PriceForSeatTypeProviders = [
  {
    provide: 'PRICE_FOR_SEAT_TYPE_REPOSITORY',
    useFactory: (dataSource: DataSource) => new PriceForSeatTypeRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
