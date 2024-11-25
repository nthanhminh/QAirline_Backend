import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Seat } from '@modules/seatsForPlaneType/entity/seat.entity';

export class SeatRepository extends BaseRepositoryAbstract<Seat> {
  constructor(dataSource: DataSource) {
    super(Seat, dataSource); 
  }
}
