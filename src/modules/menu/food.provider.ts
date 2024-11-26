import { DataSource } from 'typeorm';
import { MenuRepository } from '@repositories/food.repository';

export const menuProviders = [
  {
    provide: 'MENU_REPOSITORY',
    useFactory: (dataSource: DataSource) => new MenuRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
