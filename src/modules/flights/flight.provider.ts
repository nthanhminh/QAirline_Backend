import { DataSource } from 'typeorm';
import { FlightRepository } from '@repositories/flight.repository';

export const flightProviders = [
  {
    provide: 'FLIGHT_REPOSITORY',
    useFactory: (dataSource: DataSource) => new FlightRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
