import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { ServiceItem } from '../type/index.type';
import { EServiceType } from '../enum/index.enum';
import { Ticket } from '@modules/ticket/entity/ticket.entity';

@Entity()
export class Services extends BaseEntity {
    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    description: string;

    @Column({
      type: 'enum',
      enum: EServiceType
    })
    type: EServiceType;

    @Column('float')
    price: number;

    @ManyToMany(() => Ticket, (ticket) => ticket.services)
    tickets: Ticket[];
}
