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

@Controller('flight_price')
@ApiTags('flight_price')
@ApiBearerAuth('token')
export class FlightPriceController {
    
    constructor(private readonly flightPriceService: PriceFlightService) {}

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
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
    @Delete(':id')
    async deleteFlightPrice(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightPriceService.deleteFlightPrice(id),
        }
    }
}