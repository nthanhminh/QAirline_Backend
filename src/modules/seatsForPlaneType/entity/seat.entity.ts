import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EPlaneType } from '@modules/planes/enums/index.enum'; // Đảm bảo bạn có enum này
import { Plane } from '@modules/planes/entity/plane.entity';
import { SeatLayoutItem } from '../types/index.type';

@Entity()
export class Seat extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EPlaneType
  })
  planeType: EPlaneType; 

  @Column('json')
  seatLayoutForPlaneType: SeatLayoutItem[];

  @OneToMany(() => Plane, (plane) => plane.seatLayoutId)
  planes: Plane[]; 
}
