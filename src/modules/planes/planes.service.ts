import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Plane } from "./entity/plane.entity";
import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PlaneRepository } from "@repositories/plane.repository";
import { UpdateResult } from "typeorm";
import { CreateNewPlaneDto } from "./dto/createNewPlane.dto";
import { UpdatePlaneDto } from "./dto/updatePlane.dto";
import { FindAllResponse } from "src/types/common.type";
import { SeatService } from "@modules/seatsForPlaneType/seats.service";
import { Seat } from "@modules/seatsForPlaneType/entity/seat.entity";

@Injectable()
export class PlaneService extends BaseServiceAbstract<Plane> {
    constructor(
        @Inject('PLANE_REPOSITORY')
        private readonly planeRepository: PlaneRepository,
        @Inject(forwardRef(() => SeatService))
        private readonly seatService: SeatService
    ) {
        super(planeRepository);
    }

    async createPlane(dto: CreateNewPlaneDto): Promise<Plane> {
        const { type, ...data } = dto;
        const seatLayout = await this.seatService.findOneByType(type);
        if (!seatLayout) {
            throw new NotFoundException('seats.seat layout not found');
        }
        return await this.planeRepository.create({
            ...data,
            seatLayoutId: seatLayout
        });
    }

    async updatePlane(id: string, dto: UpdatePlaneDto): Promise<UpdateResult> {
        const plane = await this.planeRepository.findOneById(id);
        if(!plane) {
            throw new NotFoundException('planes.Plane not found');
        }
        const { type, ...data } = dto;
        const seatLayout = await this.seatService.findOneByType(type);
        if (!seatLayout) {
            throw new NotFoundException('seats.seat layout not found');
        }
        return await this.planeRepository.update(id, {
            ...data,
            seatLayoutId: seatLayout
        });
    }

    async deletePlane(id: string): Promise<UpdateResult> {
        return await this.planeRepository.softDelete(id);
    }

    async getPlaneList() : Promise<FindAllResponse<Plane>> {
        return await this.planeRepository.findAll({},{
            relations: ['seatLayoutId'], 
        });
    }

    async getPlaneById(id: string): Promise<Plane> {
        return await this.planeRepository.findOneById(id, {
            relations: ['seatLayoutId'], 
        })
    }
}

