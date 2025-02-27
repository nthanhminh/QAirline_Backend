import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { FlightPrice } from "./entity/priceForFlight.entity";
import { PriceFlightService } from "./priceForFlight.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CreateNewPriceForFlightDto } from "./dto/createNewPriceForFlight.dto";
import { UpdatePriceForFlightDto } from "./dto/updatePriceForFlight.dto";
import { UpdateResult } from "typeorm";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { Roles } from "src/decorators/roles.decorator";
import { CreateAllPriceDto, UpdateAllPriceDto } from "./dto/updateAllPrice.dto";

@Controller('flight_price')
@ApiTags('flight_price')
export class FlightPriceController {
    
    constructor(private readonly flightPriceService: PriceFlightService) {}

    @Get()
    async getAllPriceForFlight(
        @Query('flightId') flightId: string
    ) : Promise<AppResponse<FindAllResponse<FlightPrice>>> {
        return {
            data: await this.flightPriceService.findAllPriceForFlight(flightId),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Post()
    async createNewFlightPrice(
        @Body() dto: CreateNewPriceForFlightDto
    ) : Promise<AppResponse<FlightPrice>> {
        return {
            data: await this.flightPriceService.createNewFlightPrice(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Patch('updateAllPrice')
    async updateAllPrice(
        @Body() dto: UpdateAllPriceDto,
    ): Promise<AppResponse<boolean>> {
        return {
            data: await this.flightPriceService.updateAllFlightPrice(dto)
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Patch(':id')
    async updateFlightPrice(
        @Param('id') id: string,
        @Body() dto: UpdatePriceForFlightDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightPriceService.updateFlightPrice(id, dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Post('createAllPrice')
    async createAllPrice(
        @Body() dto: CreateAllPriceDto,
    ): Promise<AppResponse<boolean>> {
        return {
            data: await this.flightPriceService.createAllFlightPrice(dto)
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @ApiBearerAuth('token')
    @Delete(':id')
    async deleteFlightPrice(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightPriceService.deleteFlightPrice(id),
        }
    }
}