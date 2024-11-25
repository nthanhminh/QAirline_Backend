import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Plane } from '@modules/planes/entity/plane.entity';

export class PlaneRepository extends BaseRepositoryAbstract<Plane> {
  constructor(dataSource: DataSource) {
    super(Plane, dataSource); 
  }
}
