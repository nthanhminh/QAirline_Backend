import {
    Entity,
    Column,
    OneToMany,
    ManyToMany,
  } from 'typeorm';
  import { BaseEntity } from '@modules/shared/base/base.entity';
import { Flight } from '@modules/flights/entity/flight.entity';
import { News } from '@modules/news/entity/news.entity';
import { ERegionType } from '../enums/index.enum';
  
  @Entity()
  export class Airport extends BaseEntity {
    @Column({ length: 500 })
    name: string;

    @Column({ length: 500 })
    code: string;

    @Column({ length: 500 })
    location: string;  

    @Column({ 
      type: 'enum',
      enum: ERegionType,
      default: ERegionType.VIET_NAM
    })
    region: string;  

    @OneToMany(() => Flight, (flight) => flight.fromAirport)
    departingFlights: Flight[];

    @OneToMany(() => Flight, (flight) => flight.toAirport)
    arrivingFlights: Flight[];

    @ManyToMany(() => News, (news) => news.airports)
    discounts: News[];
}
  