import { DataSource } from 'typeorm';
import { FilesRepository } from '@repositories/files.repository';

export const filesProviders = [
  {
    provide: 'FILES_REPOSITORY',
    useFactory: (dataSource: DataSource) => new FilesRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
