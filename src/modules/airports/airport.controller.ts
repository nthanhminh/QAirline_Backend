import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { FindAirportDto } from "./dto/findAirport.dto";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { Airport } from "./entity/airport.entity";
import { AirportService } from "./airport.service";
import { CreateNewAirportDto } from "./dto/createNewAiport.dto";
import { UpdateAirportDto } from "./dto/updateAirport.dto";
import { UpdateResult } from "typeorm";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";

@ApiTags('airports')
@ApiBearerAuth('token')
@Controller('airports')
export class AirportsController {

    constructor(private readonly airportService: AirportService) {}

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get()
    async findAirports(@Query() dto: FindAirportDto) : Promise<AppResponse<FindAllResponse<Airport>>> {
        return {
            data: await this.airportService.findAirport(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Post()
    async createAirport(@Body() dto: CreateNewAirportDto) : Promise<AppResponse<Airport>> {
        return {
            data: await this.airportService.createAirport(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Patch(':id')
    async updateAirport(
        @Param('id') id: string,
        @Body() dto: UpdateAirportDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.airportService.updateAirport(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Delete(':id')
    async deleteAirport(
        @Param('id') id: string,
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.airportService.deleteAirport(id),
        }
   }
}