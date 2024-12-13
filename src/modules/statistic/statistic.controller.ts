import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { StatisticService } from "./statistic.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EFlightStatus } from "@modules/flights/enums/index.enum";
import { AppResponse } from "src/types/common.type";
import { FlightStatisticByBooking, FlightStatisticDashboard, FlightStatisticGroupByAirport, TicketCount } from "./type/index.type";
import { TicketStatisticDto } from "./dto/ticketStatistic.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { Roles } from "src/decorators/roles.decorator";
import { ERolesUser } from "@modules/users/enums/index.enum";
import { RolesGuard } from "@modules/auth/guards/roles.guard";
import { JwtAccessTokenGuard } from "@modules/auth/guards/jwt-access-token.guard";
import { BookingDetailDto } from "./dto/bookingDetail.dto";

@Controller('admins')
@ApiTags('admins')
@ApiBearerAuth('token')
export class StatisticController {

    constructor(private readonly statisticService: StatisticService) {}

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('statistic/flightDashBoard')
    async getStatisticForFlight() : Promise<AppResponse<FlightStatisticDashboard>> {
        return {
            data: await this.statisticService.getFlightStatisticDashboard(),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('statistic/flightChartData')
    async getChartDataForFlight() : Promise<AppResponse<any>> {
        return {
            data: await this.statisticService.getFlightsCountByMonth(),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('statistic/ticketStatistic')
    async getTicketStatistics(@Query() dto:TicketStatisticDto) : Promise<AppResponse<TicketCount[]>> {
        const { timeType } = dto
        return {
            data: await this.statisticService.getTicketStatistic(timeType),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('statistic/flightStatisticByAirport')
    async getAirportStatisticByAirport() : Promise<AppResponse<FlightStatisticGroupByAirport[]>> {
        return {
            data: await this.statisticService.getFlightStatisticsGroupbyAirport()
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('statistic/flightStatisticByBooking')
    async getBookingStatisticByBooking(@Query() dto: PaginationDto) : Promise<AppResponse<FlightStatisticByBooking[]>> {
        return {
            data: await this.statisticService.getFlightStatisticByBooking(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('booking')
    async getBookingDetails(@Query() dto: BookingDetailDto) {
        return {
            data: await this.statisticService.getBookingDetails(dto),
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('getAllTickets') 
    async getAllTickets() : Promise<AppResponse<number>> {
        return {
            data: await this.statisticService.getAllTicket()
        }
    }

    @Roles(ERolesUser.ADMIN)
    @UseGuards(RolesGuard)
	@UseGuards(JwtAccessTokenGuard)
    @Get('getAllFlights') 
    async getAllFlights() : Promise<AppResponse<number>> {
        return {
            data: await this.statisticService.getAllFlight()
        }
    }
}
