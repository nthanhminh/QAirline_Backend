import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Services } from "./entity/service.entity";
import { Inject, Injectable } from "@nestjs/common";
import { ServicesRepository } from "@repositories/services.repository";
import { CreateNewServiceDto } from "./dto/createNewService.dto";
import { ServiceUpdateDto } from "./dto/updateService.dto";
import { UpdateResult } from "typeorm";
import { ServiceItemDto } from "./dto/service.dto";
import { FindAllResponse } from "src/types/common.type";

@Injectable()
export class ServiceHandler extends BaseServiceAbstract<Services> {
    constructor(
        @Inject('SERVICES_REPOSITORY')
        private readonly serviceRepository: ServicesRepository
    ) {
        super(serviceRepository)
    }

    async createNewService(dto: CreateNewServiceDto) : Promise<Services> {
        return await this.serviceRepository.create(dto);
    }

    async addNewServiceChild(id: string, dto: ServiceItemDto): Promise<UpdateResult> {
        const services = await this.serviceRepository.findOneByCondition({ id });
    
        if (!services) {
            throw new Error('services.Service not found');
        }

        const { service } = dto;

        const servicesList = [...services.services, service];

        return await this.serviceRepository.update(id, {
            services: servicesList,
        });
    }
    

    async updateService(id: string, dto: ServiceUpdateDto) : Promise<UpdateResult> {
        return await this.serviceRepository.update(id, dto);
    }

    async deleteService(id: string) : Promise<UpdateResult> {
        return await this.serviceRepository.softDelete(id);
    }

    async getAllServices() : Promise<FindAllResponse<Services>> {
        return await this.serviceRepository.findAll({});
    }
}