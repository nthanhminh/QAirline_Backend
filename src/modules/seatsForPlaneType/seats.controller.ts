import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateNewSeatLayoutDto } from "./dto/createNewSeatLayout.dto";
import { SeatService } from "./seats.service";
import { AppResponse } from "src/types/common.type";
import { Seat } from "./entity/seat.entity";
import { UpdateSeatLayoutDto } from "./dto/updateSeatLayout.dto";
import { UpdateResult } from "typeorm";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { Roles } from "src/decorators/roles.decorator";

@Controller('seats')
@ApiTags('seats')
@ApiBearerAuth('token')
export class SeatsController {

    constructor(
        private readonly seatService: SeatService
    ) {}

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createNewSeatLayout(@Body() dto: CreateNewSeatLayoutDto) : Promise<AppResponse<Seat>> {
        return {
            data: await this.seatService.createSeatLayout(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateSeatLayout(
        @Param('id') id: string,
        @Body() dto: UpdateSeatLayoutDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.seatService.updateSeatLayout(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteSeatLayout(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.seatService.deleteSeatLayout(id),
        }
    }
}