import { DataSource } from 'typeorm';
import { SeatClassInfoRepository } from '@repositories/seatClassInfo.repository';

export const seatClassInfoProviders = [
  {
    provide: 'SEAT_CLASS_INFO_REPOSITORY',
    useFactory: (dataSource: DataSource) => new SeatClassInfoRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
