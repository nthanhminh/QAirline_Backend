import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { News } from '@modules/news/entity/news.entity';

export class NewsRepository extends BaseRepositoryAbstract<News> {
  constructor(dataSource: DataSource) {
    super(News, dataSource); 
  }
}
