import { ApiTags } from "@nestjs/swagger";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { FlightPrice } from "./entity/priceForFlight.entity";
import { PriceFlightService } from "./priceForFlight.service";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateNewPriceForFlightDto } from "./dto/createNewPriceForFlight.dto";
import { UpdatePriceForFlightDto } from "./dto/updatePriceForFlight.dto";
import { UpdateResult } from "typeorm";

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


    @Post()
    async createNewFlightPrice(
        @Body() dto: CreateNewPriceForFlightDto
    ) : Promise<AppResponse<FlightPrice>> {
        return {
            data: await this.flightPriceService.createNewFlightPrice(dto),
        }
    }

    @Patch(':id')
    async updateFlightPrice(
        @Param('id') id: string,
        @Body() dto: UpdatePriceForFlightDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightPriceService.updateFlightPrice(id, dto),
        }
    }

    @Delete(':id')
    async deleteFlightPrice(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightPriceService.deleteFlightPrice(id),
        }
    }
}