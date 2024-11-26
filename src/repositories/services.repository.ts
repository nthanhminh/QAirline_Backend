import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Services } from '@modules/services/entity/service.entity';

export class ServicesRepository extends BaseRepositoryAbstract<Services> {
  constructor(dataSource: DataSource) {
    super(Services, dataSource); 
  }
}
