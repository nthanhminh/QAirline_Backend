import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { SeatClassInfo } from "./entity/seatClassInfo.entity";
import { SeatClassInfoService } from "./seatClassInfo.service";
import { CreateNewSeatClassInfoDto } from "./dto/createNewSeatClassInfo.dto";
import { UpdateSeatClassInfoDto } from "./dto/updateSeatClassInfo.dto";
import { UpdateResult } from "typeorm";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";

@Controller('seat_class_info')
@ApiTags('seat_class_info')
export class SeatClassInfoController {

    constructor(private readonly seatClassInfoService: SeatClassInfoService) {}

	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Get()
    async getAllSeatClassInfo() : Promise<AppResponse<FindAllResponse<SeatClassInfo>>> {
        return {
            data: await this.seatClassInfoService.getAllSeatClassInfo(),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createNewSeatClassInfo(@Body() dto: CreateNewSeatClassInfoDto) : Promise<AppResponse<SeatClassInfo>> {
        return {
            data: await this.seatClassInfoService.creatNewSeatClassInfo(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateSeatClassInfo(
        @Param('id') id: string,
        @Body() dto: UpdateSeatClassInfoDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.seatClassInfoService.updateSeatClassInfo(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@ApiBearerAuth('token')
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteSeatClassInfo(@Param('id') id: string) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.seatClassInfoService.deleteSeatClassInfo(id),
        }
    }
}
