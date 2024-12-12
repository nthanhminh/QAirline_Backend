import { Body, Controller, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TicketService } from "./ticket.service";
import { AppResponse } from "src/types/common.type";
import { Ticket } from "./entity/ticket.entity";
import { CreateNewTicketDto } from "./dto/createNewTicket.dto";
import { DataSource, UpdateResult } from "typeorm";
import { StatusChangeDto } from "./dto/statusChange.dto";
import { UpdateTicketDto } from "./dto/updateNewTicket.dto";
import { CheckinDto } from "./dto/checkin.dto";
import { ETicketStatus } from "./enums/index.enum";

@Controller('tickets')
@ApiTags('tickets')
export class TicketController {
    constructor(
        private readonly ticketService: TicketService,
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
    ){}

    @Get()
    async getTicketInfo(@Query('id') id: string,) : Promise<AppResponse<Ticket>> {
        return {
            data: await this.ticketService.getTicketInfo(id)
        }
    }

    @Get('/flight')
    async getTicketForFlight(@Query('flightId') flightId: string) : Promise<AppResponse<String[]>> {
        const queryRunner = this.dataSource.createQueryRunner();
        return {
            data: await this.ticketService.getTicketFromFlightId(flightId, queryRunner),
        }
    }

    @Get('/getNumberOfTicketsForFlight')
    async getNumberTicketForFlight(@Query('flightId') flightId: string) : Promise<AppResponse<number>> {
        const queryRunner = this.dataSource.createQueryRunner();
        return {
            data: await this.ticketService.getNumberOfTicketFromFlightId(flightId, queryRunner),
        }
    }
    
    @Patch('checkin/:id')
    async checking(@Param('id') id: string) : Promise<AppResponse<any>>{
        return {
            data: await this.ticketService.checkin(id),
        }
    }

    @Patch('confirm/:id')
    async confirm(
        @Param('id') id: string,
        @Body() dto: CheckinDto
    ) : Promise<AppResponse<any>>{
        const checkinData = {
            ...dto,
            checkinStatus: ETicketStatus.CHECKED_IN
        }
        return {
            data: await this.ticketService.update(id, checkinData),
        }
    }

    @Patch(':id')
    async adjustStatus(
        @Param('id') id: string,
        @Body() dto: UpdateTicketDto
    ) : Promise<AppResponse<UpdateResult>> {
        return {
            data: await this.ticketService.adjustTicketStatus(id, dto),
        }
    }

}