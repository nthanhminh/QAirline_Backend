import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FilterFlightDto } from "./dto/findFlight.dto";
import { FlightService } from "./flight.service";
import { AppResponse } from "src/types/common.type";
import { Flight } from "./entity/flight.entity";
import { CreateNewFlightDto } from "./dto/createNewFlight.dto";
import { UpdateFlightDto } from "./dto/updateNewFight.dto";
import { ObjectLiteral, UpdateResult } from "typeorm";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";

@Controller('flights')
@ApiTags('flights')
@ApiBearerAuth('token')
export class FlightController {
    constructor(private readonly flightService:FlightService) {}

	@UseGuards(JwtAccessTokenGuard)
    @Get()
    async filterFlight(
        @Query() dto: FilterFlightDto
    ) : Promise<AppResponse<ObjectLiteral[]>> {
        return {
            data: await this.flightService.filterFlight(dto),
            // data: await this.flightService.test()
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createNewFlight(@Body() dto: CreateNewFlightDto): Promise<AppResponse<Flight>> {
        return {
            data: await this.flightService.createNewFlight(dto),
        }
    }   

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateFlight(
        @Param('id') id: string,
        @Body() dto: UpdateFlightDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightService.updateFlight(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteFlight(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightService.deleteFlight(id),
        }
    }
}
