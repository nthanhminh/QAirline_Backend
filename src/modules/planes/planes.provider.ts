import { DataSource } from 'typeorm';
import { PlaneRepository } from '@repositories/plane.repository';

export const planeProviders = [
  {
    provide: 'PLANE_REPOSITORY',
    useFactory: (dataSource: DataSource) => new PlaneRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
