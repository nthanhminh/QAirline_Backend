import { DataSource } from 'typeorm';
import { ServicesRepository } from '@repositories/services.repository';

export const servicesProviders = [
  {
    provide: 'SERVICES_REPOSITORY',
    useFactory: (dataSource: DataSource) => new ServicesRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
