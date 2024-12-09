import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SeatRepository } from "@repositories/seat.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Seat } from "./entity/seat.entity";
import { CreateNewSeatLayoutDto } from "./dto/createNewSeatLayout.dto";
import { UpdateResult } from "typeorm";
import { UpdateSeatLayoutDto } from "./dto/updateSeatLayout.dto";
import { EPlaneType } from "@modules/planes/enums/index.enum";

@Injectable()
export class SeatService extends BaseServiceAbstract<Seat> {
    constructor(
        @Inject('SEAT_REPOSITORY')
        private readonly seatRepository: SeatRepository
    ) {
        super(seatRepository);
    }

    async createSeatLayout(dto: CreateNewSeatLayoutDto) : Promise<Seat> {
        return await this.seatRepository.create(dto);
    }

    async findOneByType(type: EPlaneType) : Promise<Seat> {
        return await this.seatRepository.findOneByCondition({
            planeType: type
        });
    }

    async updateSeatLayout(id: string, dto: UpdateSeatLayoutDto) : Promise<UpdateResult> {
        return await this.seatRepository.update(id, dto);
    }

    async deleteSeatLayout(id: string) : Promise<UpdateResult> {
        return await this.seatRepository.softDelete(id);
    }

    async checkSeatLayoutExists(id: string) : Promise<Seat> {
        const seatLayout = await this.seatRepository.findOneById(id);
        if (!seatLayout) {
            throw new NotFoundException('seats.Seat layout not found');
        }
        return seatLayout;
    }
}
