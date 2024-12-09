import { PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        select:true, 
    })
    createdAt: Date;

    @DeleteDateColumn({
        select:true,
    })
    deletedAt: Date | null; 
}
