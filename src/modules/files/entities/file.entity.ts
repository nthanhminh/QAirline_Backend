import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';

@Entity() 
export class Files extends BaseEntity {

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  path: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  filename: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  mimetype: string;
}
