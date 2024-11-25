import { DataSource } from 'typeorm';
import { SeatRepository } from '@repositories/seat.repository';

export const seatProviders = [
  {
    provide: 'SEAT_REPOSITORY',
    useFactory: (dataSource: DataSource) => new SeatRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
