import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateNewBookingDto } from "./dto/createNewBooking.dto";
import { AppResponse, ResponseMessage } from "src/types/common.type";
import { Booking } from "./entity/booking.entity";
import { EditBookingDto } from "./dto/EditBooking.dto";
import { UpdateResult } from "typeorm";
import { CancelTicketDto } from "./dto/cancelTicket.dto";

@Controller('booking')
@ApiTags('booking')
export class BookingController {
    constructor(
        private readonly bookingsService: BookingService,
    ) {}

    @Post()
    async createNewBooking(@Body() dto: CreateNewBookingDto) : Promise<AppResponse<Booking>> {
        return {
            data: await this.bookingsService.createNewBooking(dto),
        }
    }

    @Patch(':id')
    async editBooking(
        @Param('id') id: string,
        @Body() dto: EditBookingDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.bookingsService.updateBooking(id, dto)
        }
    }

    @Patch('/cancelTicket/:id')
    async cancelBooking(
        @Param('id') id: string,
        @Body() dto: CancelTicketDto
    ) : Promise<ResponseMessage> {
        return {
            message: await this.bookingsService.cancelTicket(id, dto)
        }
    }
}