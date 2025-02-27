import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FilterFlightDto } from "./dto/findFlight.dto";
import { FlightService } from "./flight.service";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { Flight } from "./entity/flight.entity";
import { CreateNewFlightDto } from "./dto/createNewFlight.dto";
import { UpdateFlightDto } from "./dto/updateNewFight.dto";
import { DataSource, ObjectLiteral, UpdateResult } from "typeorm";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";
import { SeatClassPrice } from "./type/index.type";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller('flights')
@ApiTags('flights')
@ApiBearerAuth('token')
export class FlightController {
    constructor(
        private readonly flightService:FlightService,
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource
    ) {}

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessTokenGuard)
    @Get('getFlightById')
    async getFlightById(@Query('id') id: string) : Promise<AppResponse<Flight>> {
        return {
            data: await this.flightService.getFlightWithDetailInfo(id),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessTokenGuard)
    @Get('getAllFlight')
    async getAllFlight(@Query() dto: PaginationDto) : Promise<AppResponse<FindAllResponse<Flight>>> {
        return {
            data: await this.flightService.getAllFlightWithDetailInfo(dto),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessTokenGuard)
    @Get('getSeatClassPrice')
    async getSeatClassPrice(@Query('id') id: string) : Promise<AppResponse<SeatClassPrice[]>> {
        return {
            data: await this.flightService.getSeatClassPriceForFlight(id),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessTokenGuard)
    @Get('/getNumberOfSeatsForFlight')
    async getNumberOfSeatsForFlight(@Query('id') id: string) : Promise<AppResponse<any>> {
        const queryRunner = this.dataSource.createQueryRunner();
        return {
            data: await this.flightService.getNumberOfSeatInfoForFlight(id, queryRunner),
        }
    }

    @Roles(ERolesUser.USER, ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAccessTokenGuard)
    @Get()
    async filterFlight(
        @Query() dto: FilterFlightDto
    ) : Promise<AppResponse<FindAllResponse<ObjectLiteral>>> {
        return {
            data: await this.flightService.filterFlight(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Post()
    async createNewFlight(@Body() dto: CreateNewFlightDto): Promise<AppResponse<Flight>> {
        return {
            data: await this.flightService.createNewFlight(dto),
        }
    }   

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
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
    @ApiBearerAuth('token')
    @Delete(':id')
    async deleteFlight(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightService.deleteFlight(id),
        }
    }
}
