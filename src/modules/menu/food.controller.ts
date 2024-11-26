import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { MenuService } from "./food.service";
import { Menu } from "./entity/menu.entity";
import { CreateNewFoodDto } from "./dto/createNewFood.dto";
import { UpdateResult } from "typeorm";
import { FoodUpdateDto } from "./dto/updateFood.dto";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";

@Controller('menu')
@ApiTags('menu')
@ApiBearerAuth('token')
export class MenuController {

    constructor(private readonly menuService: MenuService) {}
    @Get()
    async getMenuList(@Query() dto: PaginationDto) : Promise<AppResponse<FindAllResponse<Menu>>> {
        return {
            data: await this.menuService.getFoodList(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createNewFood(@Body() dto: CreateNewFoodDto) : Promise<AppResponse<Menu>> {
        return {
            data: await this.menuService.createNewFood(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateFood(
        @Param('id') id: string,
        @Body() dto: FoodUpdateDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.menuService.updateFood(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteFood(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.menuService.deleteFood(id),
        }
    }
}