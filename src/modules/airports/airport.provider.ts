import { AirportRepository } from '@repositories/airport.repository';
import { DataSource } from 'typeorm';

export const airportProviders = [
  {
    provide: 'AIRPORT_REPOSITORY',
    useFactory: (dataSource: DataSource) => new AirportRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
