import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { SeatClassInfo } from "./entity/seatClassInfo.entity";
import { Inject, Injectable } from "@nestjs/common";
import { SeatClassInfoRepository } from "@repositories/seatClassInfo.repository";
import { CreateNewSeatClassInfoDto } from "./dto/createNewSeatClassInfo.dto";
import { UpdateSeatClassInfoDto } from "./dto/updateSeatClassInfo.dto";
import { UpdateResult } from "typeorm";
import { FindAllResponse } from "src/types/common.type";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";

@Injectable()
export class SeatClassInfoService extends BaseServiceAbstract<SeatClassInfo> {
    constructor(
        @Inject('SEAT_CLASS_INFO_REPOSITORY')
        private readonly seatClassInfoRepository: SeatClassInfoRepository
    ) {
        super(seatClassInfoRepository);
    }

    async creatNewSeatClassInfo(dto: CreateNewSeatClassInfoDto): Promise<SeatClassInfo> {
        return await this.seatClassInfoRepository.create(dto);
    }

    async updateSeatClassInfo(id: string, dto: UpdateSeatClassInfoDto) : Promise<UpdateResult> {
        return await this.seatClassInfoRepository.update(id, dto);
    }

    async deleteSeatClassInfo(id: string) : Promise<UpdateResult> {
        return await this.seatClassInfoRepository.softDelete(id);
    }

    async getAllSeatClassInfo() : Promise<FindAllResponse<SeatClassInfo>> {
        return await this.seatClassInfoRepository.findAll({});
    }

    async getSeatClassInfoByClass(seatClass: ESeatClass) : Promise<SeatClassInfo> {
        return await this.seatClassInfoRepository.findOneByCondition({
            name: seatClass
        });
    }
}