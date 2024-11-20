import { Repository, DataSource, DeepPartial, EntityTarget, FindOptionsWhere, FindOneOptions, SaveOptions, UpdateResult, DeleteResult } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
	implements BaseRepositoryInterface<T>
{
	protected readonly repository: Repository<T>;

	constructor(
		entity: EntityTarget<T>,
		private readonly dataSource: DataSource,
	) {
		this.repository = dataSource.getRepository(entity);
	}

	async create(dto: DeepPartial<T>, options?: SaveOptions): Promise<T> {
		const entity = this.repository.create(dto);
		return await this.repository.save(entity, options);
	}	

	async insert(dtos: DeepPartial<T>[]): Promise<T[]> {
		const entities = this.repository.create(dtos); 
		return await this.repository.save(entities);
	}
	

	async findOneById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
		return await this.repository.findOne({ where: { id } as FindOptionsWhere<T>, ...options });
	}

	async findOneByCondition(
		condition: FindOptionsWhere<T>,
		options?: FindOneOptions<T>,
	): Promise<T | null> {
		return await this.repository.findOne({ where: condition, ...options });
	}

	async findAll(
		condition: FindOptionsWhere<T>,
		options?: FindOneOptions<T>,
	): Promise<FindAllResponse<T>> {
		const [items, count] = await this.repository.findAndCount({
			where: condition,
			...options,
		});
		return { count, items };
	}

	async find(
		condition: FindOptionsWhere<T>,
		options?: FindOneOptions<T>,
	): Promise<T[]> {
		return await this.repository.find({ where: condition, ...options });
	}

	async update(id: string, dto: DeepPartial<T>): Promise<UpdateResult> {
		return await this.repository.update(id, dto as any);
	}

	async softDelete(id: string): Promise<UpdateResult> {
		return await this.repository.softDelete(id);
	}

	async permanentlyDelete(id: string): Promise<DeleteResult> {
		return await this.repository.delete(id);
	}

	async updateMany(filter: FindOptionsWhere<T>, dto: DeepPartial<T>): Promise<UpdateResult> {
		return await this.repository.update(filter, dto as any);
	}

	async upsertDocument(filter: FindOptionsWhere<T>, dto: DeepPartial<T>, options?: SaveOptions): Promise<T> {
		const entity = await this.repository.preload({ ...filter, ...dto });
		if (!entity) {
			return await this.repository.save(dto, options);
		}
		return await this.repository.save(entity);
	}

	async softDeleteMany(filter: FindOptionsWhere<T>): Promise<UpdateResult> {
		return await this.repository.softDelete(filter);
	}

	async deleteMany(filter: FindOptionsWhere<T>): Promise<DeleteResult> {
		return await this.repository.delete(filter);
	}

	async startTransaction() {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.startTransaction();
		return queryRunner;
	}
}
