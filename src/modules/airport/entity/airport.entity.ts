import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
} from 'typeorm';
  
@Entity()
export class Airport { 
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 10 ,unique: true})
    code: string;
  
    @Column('text')
    name: string;

    @Column('text')
    location: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date | null;
}
