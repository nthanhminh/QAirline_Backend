import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FilterFlightDto } from "./dto/findFlight.dto";
import { FlightService } from "./flight.service";
import { AppResponse } from "src/types/common.type";
import { Flight } from "./entity/flight.entity";
import { CreateNewFlightDto } from "./dto/createNewFlight.dto";
import { UpdateFlightDto } from "./dto/updateNewFight.dto";
import { ObjectLiteral, UpdateResult } from "typeorm";

@Controller('flights')
@ApiTags('flights')
export class FlightController {
    constructor(private readonly flightService:FlightService) {}
    @Get()
    async filterFlight(
        @Query() dto: FilterFlightDto
    ) : Promise<AppResponse<ObjectLiteral[]>> {
        return {
            data: await this.flightService.filterFlight(dto),
            // data: await this.flightService.test()
        }
    }

    @Post()
    async createNewFlight(@Body() dto: CreateNewFlightDto): Promise<AppResponse<Flight>> {
        return {
            data: await this.flightService.createNewFlight(dto),
        }
    }   

    @Patch(':id')
    async updateFlight(
        @Param('id') id: string,
        @Body() dto: UpdateFlightDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightService.updateFlight(id, dto),
        }
    }

    @Delete(':id')
    async deleteFlight(
        @Param('id') id: string
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.flightService.deleteFlight(id),
        }
    }
}
