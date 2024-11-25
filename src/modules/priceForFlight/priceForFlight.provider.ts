import { DataSource } from 'typeorm';
import { FlightPriceRepository } from '@repositories/priceForFlight.repository';

export const PriceForFlightProviders = [
  {
    provide: 'PRICE_FOR_FLIGHT_REPOSITORY',
    useFactory: (dataSource: DataSource) => new FlightPriceRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
