import { DataSource } from 'typeorm';
import { BookingRepository } from '@repositories/booking.repository';

export const bookingProviders = [
  {
    provide: 'BOOKING_REPOSITORY',
    useFactory: (dataSource: DataSource) => new BookingRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
