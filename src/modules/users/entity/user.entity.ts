import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ERolesUser } from '../enums/index.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500, default: () => ERolesUser.USER })
  role: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('date', { default: () => 'CURRENT_DATE' })
  birthOfDate: Date;

  @Column('int')
  age: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null; 
}
