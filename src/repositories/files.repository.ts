import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Files } from '@modules/files/entities/file.entity';

export class FilesRepository extends BaseRepositoryAbstract<Files> {
  constructor(dataSource: DataSource) {
    super(Files, dataSource); 
  }
}
