import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Booking } from '@modules/booking/entity/booking.entity';

export class BookingRepository extends BaseRepositoryAbstract<Booking> {
  constructor(dataSource: DataSource) {
    super(Booking, dataSource); 
  }
}
