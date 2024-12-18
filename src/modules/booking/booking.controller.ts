import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BookingService } from "./booking.service";
import { CreateNewBookingDto } from "./dto/createNewBooking.dto";
import { AppResponse, ResponseMessage } from "src/types/common.type";
import { Booking } from "./entity/booking.entity";
import { EditBookingDto } from "./dto/EditBooking.dto";
import { UpdateResult } from "typeorm";
import { CancelTicketDto } from "./dto/cancelTicket.dto";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { CurrentUserDecorator } from "src/decorators/current-user.decorator";
import { User } from "@modules/users/entity/user.entity";

@Controller('booking')
@ApiTags('booking')
export class BookingController {
    constructor(
        private readonly bookingsService: BookingService,
    ) {}

    @Get(':id')
    async getBookingDetail(@Param('id') id: string): Promise<AppResponse<Booking>> {
        return {
            data: await this.bookingsService.getBookingDetails(id)
        }
    }

    @Post()
    @ApiBearerAuth('token')
    @UseGuards(JwtAccessTokenGuard)
    async createNewBooking(@Body() dto: CreateNewBookingDto, @CurrentUserDecorator() user: User) : Promise<AppResponse<Booking>> {
        return {
            data: await this.bookingsService.createNewBooking(dto, user),
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