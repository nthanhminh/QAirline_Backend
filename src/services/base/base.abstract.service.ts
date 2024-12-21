import { BaseEntity } from '@modules/shared/base/base.entity';
import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';
import { FindAllResponse } from 'src/types/common.type';
import { BaseServiceInterface } from './base.interface.service';
import { FindOptionsWhere, UpdateResult, DeleteResult } from 'typeorm';
import { DeepPartial } from 'typeorm'; 
import { In } from 'typeorm'; 

export abstract class BaseServiceAbstract<T extends BaseEntity>
    implements BaseServiceInterface<T>
{
    constructor(private readonly repository: BaseRepositoryInterface<T>) {}

    async create(createDto: DeepPartial<T>): Promise<T> {
        return await this.repository.create(createDto);
    }

    async findAll(
        filter?: FindOptionsWhere<T>,
        options?: object,
    ): Promise<FindAllResponse<T>> {
        return await this.repository.findAll(filter, options);
    }

    async find(filter?: FindOptionsWhere<T>, options?: object): Promise<T[]> {
        return await this.repository.find(filter, options);
    }

    async findOne(id: string, options?: object): Promise<T | null> {
        return await this.repository.findOneById(id, options);
    }

    async findOneByCondition(filter: FindOptionsWhere<T>, options?: object): Promise<T | null> {
        return await this.repository.findOneByCondition(filter as any, options);
    }

    async update(id: string, updateDto: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, updateDto);
        return this.findOne(id); 
    }

    async upsertDocument(filter: FindOptionsWhere<T>, updateDto: DeepPartial<T>): Promise<T> {
		return await this.repository.upsertDocument(filter, updateDto);
	}	

    async remove(id: string): Promise<boolean> {
        const result = await this.repository.softDelete(id);
        return result.affected > 0; // Return true if deleted
    }

    async updateMany(filter: FindOptionsWhere<T>, dto: DeepPartial<T>): Promise<UpdateResult> {
        return await this.repository.updateMany(filter, dto);
    }

    async removeMany(ids: string[]): Promise<DeleteResult> {
		const filter: FindOptionsWhere<T> = {
			id: In(ids) as any, 
		};
		return await this.repository.softDeleteMany(filter);
	}
}
