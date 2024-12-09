import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { Ticket } from '@modules/ticket/entity/ticket.entity';
import { EMenuType } from '../enums/index.enum';

@Entity()
export class Menu extends BaseEntity {
  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({
    type: 'enum',

    enum: EMenuType,
    default: EMenuType.FOOD,
  })
  type: EMenuType;

  @Column({ length: 500 })
  thumbnail: string;

  @Column('float')
  price: number;

  @ManyToMany(() => Ticket, (ticket) => ticket.menus)
  tickets: Ticket[];
}
