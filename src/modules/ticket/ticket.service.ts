import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Ticket } from "./entity/ticket.entity";
import { forwardRef, Inject, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { TicketRepository } from "@repositories/ticket.repository";
import { CreateNewTicketDto } from "./dto/createNewTicket.dto";
import { MenuService } from "@modules/menu/food.service";
import { BookingService } from "@modules/booking/booking.service";
import { ServiceHandler } from "@modules/services/services.handler";
import { StatusChangeDto } from "./dto/statusChange.dto";
import { QueryRunner, UpdateResult } from "typeorm";
import { FindAllResponse } from "src/types/common.type";
import { Booking } from "@modules/booking/entity/booking.entity";
import { UpdateTicketDto } from "./dto/updateNewTicket.dto";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { EBookingStatus } from "@modules/booking/enums/index.enum";

@Injectable()
export class TicketService extends BaseServiceAbstract<Ticket> {
    constructor(
        @Inject("TICKET_REPOSITORY")
        private readonly ticketRepository: TicketRepository,
        @Inject(forwardRef(() => BookingService))
        private readonly bookingService: BookingService,
        private readonly menuService: MenuService,
        private readonly serviceHandler: ServiceHandler
    ) {
        super(ticketRepository);
    }

    async createNewTicket(dto: CreateNewTicketDto, queryRunner: QueryRunner) : Promise<Ticket> {
        let { bookingId, menuIds, serviceIds, ...data} = dto;

        menuIds = [].concat(menuIds);
        serviceIds = [].concat(serviceIds);
        const menus = await Promise.all(
            menuIds.map((id) =>  this.menuService.findOneByCondition({ id }))
        );
        
        const services = await Promise.all(
            serviceIds.map((id) => this.serviceHandler.findOneByCondition({ id }))
        );
        
        if (menus.includes(null) || menus.includes(undefined)) {
            throw new NotFoundException('menus.menu not found');
        }
        
        if (services.includes(null) || services.includes(undefined)) {
            throw new NotFoundException('services.service not found');
        }
    
        if(!menus) {
            throw new NotFoundException('menus.menu not found');
        }

        if(!services) {
            throw new NotFoundException('services.service not found');
        }

        const ticketRepository = queryRunner.manager.getRepository(Ticket);
        
        const newTicket = await ticketRepository.create({
            ...data,
            booking: bookingId as Booking,
            menus: menus,
            services: services
        })
        
        return await ticketRepository.save(newTicket);
    }

    async updateTicket(dto: UpdateTicketDto, id: string, queryRunner: QueryRunner, flightId: string) : Promise<UpdateResult> {
        const { seatClass, seatValue } = dto;
        const ticketRepository = queryRunner.manager.getRepository(Ticket);
    
        const ticket = await ticketRepository.findOne({ where: { id } });

        if (!ticket) {
            throw new Error(`ticks.ticket not found`);
        }

        if((seatValue && seatValue!=ticket.seatClass) || (seatClass && seatClass!==ticket.seatClass)) {
            await this.checkBeforeUpdate(queryRunner, flightId, seatValue, seatClass);
        }

        const newTicket = await ticketRepository.update(id, dto);
    
        return newTicket;
    }

    async cancelTicket(id: string, queryRunner: QueryRunner) : Promise<UpdateResult> {
        const ticketRepository = queryRunner.manager.getRepository(Ticket);
    
        const ticket = await ticketRepository.findOne({ where: { id } });

        if (!ticket) {
            throw new Error(`ticks.ticket not found`);
        }

        const newTicket = await ticketRepository.update(id, {status: EBookingStatus.CANCELLED});
    
        return newTicket;
    }

    async checkBeforeUpdate(queryRunner: QueryRunner, flightId: string, seatValue: string, seatClass: ESeatClass) {
        const listSeatBooked: string[] = await this.getTicketFromFlightId(flightId, queryRunner);
        if(listSeatBooked.includes(`${seatValue}-${seatClass}`)) {
            throw new UnprocessableEntityException(`seats.${seatValue} is already booked`);
        }
    }

    async adjustTicketStatus(id: string, dto: StatusChangeDto) : Promise<UpdateResult> {
        return await this.ticketRepository.update(id, dto);
    }

    async getTicketInfo(id: string) : Promise<Ticket> {
        const ticket = await this.ticketRepository.findOneByCondition(
            { id },
            { relations: ['menus', 'services', 'booking'] } 
        );

        return ticket;
    }

    // async getTicketFromFlightId(flightId: string) : Promise<String[]> {
    //     const {items} =  await this.ticketRepository.findAll({}, {
    //         relations: ['booking'],
    //         where: {
    //             booking: {
    //                 flight: {
    //                     id: flightId
    //                 }
    //             }
    //         }
    //     })

    //     return items.map((ticket) => `${ticket.seatValue}-${ticket.seatClass}`);
    // }

    async getTicketFromFlightId(flightId: string, queryRunner: QueryRunner): Promise<string[]> {
        const tickets = await queryRunner.manager
            .createQueryBuilder('ticket', 'ticket')
            .leftJoinAndSelect('ticket.booking', 'booking')
            .leftJoinAndSelect('booking.flight', 'flight')
            .where('flight.id = :flightId', { flightId })
            .select(['ticket.seatValue', 'ticket.seatClass'])
            .getMany();
    
        return tickets.map(ticket => `${ticket.seatValue}-${ticket.seatClass}`);
    }
};