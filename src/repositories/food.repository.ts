import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Menu } from '@modules/menu/entity/menu.entity';

export class MenuRepository extends BaseRepositoryAbstract<Menu> {
  constructor(dataSource: DataSource) {
    super(Menu, dataSource); 
  }
}
