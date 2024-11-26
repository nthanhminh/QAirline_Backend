import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { ServiceItem } from '../type/index.type';

@Entity()
export class Services extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column('json')
  services: ServiceItem[];
}
