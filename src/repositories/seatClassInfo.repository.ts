import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { SeatClassInfo } from '@modules/seatClassInfo/entity/seatClassInfo.entity';


export class SeatClassInfoRepository extends BaseRepositoryAbstract<SeatClassInfo> {
  constructor(dataSource: DataSource) {
    super(SeatClassInfo, dataSource); 
  }
}
