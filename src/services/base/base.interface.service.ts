import { FindAllResponse } from 'src/types/common.type';
import { DeepPartial, FindOptionsWhere, SaveOptions, UpdateResult, DeleteResult } from 'typeorm';

export interface Write<T> {
    create(item: DeepPartial<T>): Promise<T>; 
    update(id: string, item: DeepPartial<T>): Promise<T | null>; 
    upsertDocument(filter: FindOptionsWhere<T>, updateDto: DeepPartial<T>): Promise<T>;
    remove(id: string): Promise<boolean>;
    updateMany(filter: FindOptionsWhere<T>, dto: DeepPartial<T>): Promise<UpdateResult>;
    removeMany(ids: string[]): Promise<DeleteResult>;
}

export interface Read<T> {
    findAll(filter?: FindOptionsWhere<T>, options?: object): Promise<FindAllResponse<T>>;
    find(filter?: FindOptionsWhere<T>, options?: object): Promise<T[]>;
    findOne(id: string, options?: object): Promise<T | null>; 
    findOneByCondition(condition: FindOptionsWhere<T>, options?: object): Promise<T | null>;
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> {}
