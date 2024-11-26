import { Inject, Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Menu } from "./entity/menu.entity";
import { MenuRepository } from "@repositories/food.repository";
import { CreateNewFoodDto } from "./dto/createNewFood.dto";
import { FoodUpdateDto } from "./dto/updateFood.dto";
import { UpdateResult } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FindAllResponse } from "src/types/common.type";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";

@Injectable()
export class MenuService extends BaseServiceAbstract<Menu> {
    constructor(
        @Inject('MENU_REPOSITORY') 
        private readonly menuRepository: MenuRepository,
    ) {
        super(menuRepository);
    }

    async createNewFood(dto: CreateNewFoodDto) : Promise<Menu> {
        return await this.menuRepository.create(dto);
    }

    async updateFood(id: string, dto: FoodUpdateDto) : Promise<UpdateResult> {
        return await this.menuRepository.update(id, dto);
    }

    async deleteFood(id: string) : Promise<UpdateResult> {
        return await this.menuRepository.softDelete(id);
    }

    async getFoodList(dto: PaginationDto) : Promise<FindAllResponse<Menu>> {
        const {page, pageSize} = dto;
        const {skip, limit } = _getSkipLimit({page, pageSize});
        return await this.menuRepository.findAll({}, {
            take: limit,
            skip: skip
        })
    }
}