import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Services } from "./entity/service.entity";
import { Inject, Injectable } from "@nestjs/common";
import { ServicesRepository } from "@repositories/services.repository";
import { CreateNewServiceDto } from "./dto/createNewService.dto";
import { ServiceUpdateDto } from "./dto/updateService.dto";
import { UpdateResult } from "typeorm";
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

    async updateService(id: string, dto: ServiceUpdateDto) : Promise<UpdateResult> {
        return await this.serviceRepository.update(id, dto);
    }

    async deleteService(id: string) : Promise<UpdateResult> {
        return await this.serviceRepository.softDelete(id);
    }

    async getAllServices(): Promise<{ type: string; items: Services[] }[]> {
        const services = await this.serviceRepository.findAll({}, {
            order: {
                createdAt: 'DESC',
            },
        });
    
        const groupedServices = services.items.reduce((acc, service) => {
            const type = service.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(service);
            return acc;
        }, {} as Record<string, Services[]>);
    
        return Object.entries(groupedServices).map(([type, items]) => ({
            type,
            items,
        }));
    }    
}