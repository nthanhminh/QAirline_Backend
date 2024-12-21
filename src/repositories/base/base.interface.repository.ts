import { FindOptionsWhere, FindOneOptions, SaveOptions, UpdateResult, DeleteResult, DeepPartial } from 'typeorm';
import { FindAllResponse } from 'src/types/common.type';

export interface BaseRepositoryInterface<T> {
    create(dto: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    insert(dtos: DeepPartial<T>[]): Promise<T[]>
    findOneById(id: string, options?: FindOneOptions<T>): Promise<T | null>;
    findOneByCondition(condition: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T | null>;
    findAll(condition: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<FindAllResponse<T>>;
    find(condition: FindOptionsWhere<T>, options?: FindOneOptions<T>): Promise<T[]>;
    update(id: string, dto: DeepPartial<T>): Promise<UpdateResult>; 
    softDelete(id: string): Promise<UpdateResult>;
    permanentlyDelete(id: string): Promise<DeleteResult>;
    updateMany(filter: FindOptionsWhere<T>, dto: DeepPartial<T>): Promise<UpdateResult>;
    upsertDocument(filter: FindOptionsWhere<T>, dto: DeepPartial<T>, options?: SaveOptions): Promise<T>;
    softDeleteMany(filter: FindOptionsWhere<T>): Promise<UpdateResult>;
    deleteMany(filter: FindOptionsWhere<T>): Promise<DeleteResult>;
}
