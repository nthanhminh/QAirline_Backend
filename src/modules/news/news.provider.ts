import { NewsRepository } from '@repositories/news.repository';
import { DataSource } from 'typeorm';

export const newsProviders = [
  {
    provide: 'NEWS_REPOSITORY',
    useFactory: (dataSource: DataSource) => new NewsRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
