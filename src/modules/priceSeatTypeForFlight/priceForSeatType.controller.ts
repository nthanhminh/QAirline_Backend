import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppResponse, FindAllResponse } from "src/types/common.type";
import { PriceForSeatTypeService } from "./priceForSeatType.service";
import { PriceForSeatType } from '@modules/priceSeatTypeForFlight/entity/priceForSeatType.entity';
import { CreateNewPriceForSeatTypeDto } from "./dto/createNewPriceForSeatType.dto";
import { UpdatePriceForSeatTypeDto } from "./dto/updatePriceForSeatType.dto";
import { UpdateResult } from "typeorm";

@Controller('seat_type_price')
@ApiTags('seat_type_price')
export class PriceForSeatTypeController {

    constructor(
        private readonly priceForSeatTypeService: PriceForSeatTypeService
    ) {}

    @Get()
    async getPriceForSeatType(@Query('flightId') flightId: string): Promise<AppResponse<FindAllResponse<PriceForSeatType>>> {
        return {
            data: await this.priceForSeatTypeService.findAllPriceForFlight(flightId),
        }
    }

    @Post()
    async createNewPriceForSeatType(@Body() dto: CreateNewPriceForSeatTypeDto) : Promise<AppResponse<PriceForSeatType>> {
        return {
            data: await this.priceForSeatTypeService.createNewPriceForSeatType(dto),
        }
    }


    @Patch('id')
    async updatePriceForSeatType(
        @Param('id') id: string,
        @Body() dto: UpdatePriceForSeatTypeDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.priceForSeatTypeService.updatePriceForSeatType(id, dto),
        }
    }

    @Delete()
    async deletePriceForSeatType(
        @Param('id') id: string,
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.priceForSeatTypeService.deletePriceForSeatType(id),
        }
    }
}