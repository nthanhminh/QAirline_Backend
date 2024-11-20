import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { User } from '@modules/users/entity/user.entity';


export class UserRepository extends BaseRepositoryAbstract<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource); 
  }
}
