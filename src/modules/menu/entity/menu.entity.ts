import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';

@Entity()
export class Menu extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ length: 500 })
  thumbnail: string;

  @Column('float')
  price: number;
}
