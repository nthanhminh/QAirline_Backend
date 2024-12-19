import { Inject, Injectable } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Menu } from "./entity/menu.entity";
import { MenuRepository } from "@repositories/food.repository";
import { CreateNewFoodDto } from "./dto/createNewFood.dto";
import { FoodUpdateDto } from "./dto/updateFood.dto";
import { DataSource, UpdateResult } from "typeorm";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FindAllResponse } from "src/types/common.type";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";

@Injectable()
export class MenuService extends BaseServiceAbstract<Menu> {
    constructor(
        @Inject('MENU_REPOSITORY') 
        private readonly menuRepository: MenuRepository,

        @Inject('DATA_SOURCE') 
        private readonly dataSource: DataSource
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

    async getFoodList(dto: PaginationDto): Promise<{ type: string; items: Menu[] }[]> {
        const { page, pageSize } = dto;
        const { skip, limit } = _getSkipLimit({ page, pageSize });
    
        const menuItems = await this.menuRepository.findAll({}, {
            take: limit,
            skip: skip,
        });
    
        const groupedMenus = menuItems.items.reduce((acc, item) => {
            const type = item.type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {} as Record<string, Menu[]>);
    
        return Object.entries(groupedMenus).map(([type, items]) => ({
            type,
            items,
        }));
    }
    

    async getFoodList1(dto: PaginationDto): Promise<{ type: string; items: Menu[] }[]> {
        const { page, pageSize } = dto;
        const { skip, limit } = _getSkipLimit({ page, pageSize });
    
        const query = this.dataSource
            .getRepository(Menu)
            .createQueryBuilder("menu")
            .select(["menu.type", "menu.id", "menu.name", "menu.price", "menu.description"])
            .groupBy("menu.type")
            .addGroupBy("menu.id")
            .skip(skip)
            .limit(limit);
    
        const groupedResults = await query.getRawMany();
    
        return groupedResults.map(result => ({
            type: result.menu_type,
            items: result.items,
        }));
    }    
}