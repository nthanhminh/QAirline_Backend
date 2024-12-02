import { Entity, Column, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { Airport } from '@modules/airports/entity/airport.entity';
import { ENewsType } from '../enums/index.enums';
import { Files } from '@modules/files/entities/file.entity';

@Entity()
export class News extends BaseEntity {
    @Column('text')
    title: string;

    @Column({
        type: 'text',
        nullable: true,
        default: null
    })
    content: string;

    @Column({
        type: 'float',
        nullable: true,
        default: null,
    })
    percentDiscount: number;

    @Column({
        type: 'float',
        nullable: true,
        default: null,
    })
    cashDiscount: number;

    @Column({
        type: 'text',
    })
    imageUrl: string

    @Column({
        type: 'enum',
        enum: ENewsType
    })
    type: ENewsType

    @Column({
        type: 'timestamp',
        nullable: true,
        default: null
    })
    endTime: Date

    @ManyToMany(() => Airport, (airport) => airport.discounts, { eager: true })
    @JoinTable({ 
        name: 'airport_discount',
        joinColumns: [{ name: 'news_id', referencedColumnName: 'id' }],
        inverseJoinColumns: [{ name: 'airport_id', referencedColumnName: 'id' }] 
    })
    airports: Airport[];
}
