import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EPlaneType } from '@modules/planes/enums/index.enum';
import { Plane } from '@modules/planes/entity/plane.entity';
import { SeatLayoutItem } from '../types/index.type';

@Entity()
export class Seat extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EPlaneType
  })
  planeType: EPlaneType; 

  @Column({
    type: 'integer',
    default: 20
  })
  numberOfBusinessSeats: number; 

  @Column({
    type: 'integer',
    default: 30
  })
  numberOfPreminumEconomySeats: number; 

  @Column({
    type: 'integer',
    default: 40
  })
  numberOfEconomySeats: number; 

  @Column({
    type: 'integer',
    default: 50
  })
  numberOfBasicSeats: number; 

  @Column('json')
  seatLayoutForPlaneType: SeatLayoutItem[];

  @OneToMany(() => Plane, (plane) => plane.seatLayoutId)
  planes: Plane[]; 
}
