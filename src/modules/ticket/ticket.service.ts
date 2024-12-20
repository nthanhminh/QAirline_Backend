import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Ticket } from "./entity/ticket.entity";
import { forwardRef, Inject, Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { TicketRepository } from "@repositories/ticket.repository";
import { CreateNewTicketDto } from "./dto/createNewTicket.dto";
import { MenuService } from "@modules/menu/food.service";
import { BookingService } from "@modules/booking/booking.service";
import { ServiceHandler } from "@modules/services/services.handler";
import { StatusChangeDto } from "./dto/statusChange.dto";
import { DataSource, ObjectLiteral, QueryRunner, UpdateResult } from "typeorm";
import { FindAllResponse } from "src/types/common.type";
import { Booking } from "@modules/booking/entity/booking.entity";
import { UpdateTicketDto } from "./dto/updateNewTicket.dto";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { EBookingStatus } from "@modules/booking/enums/index.enum";
import { FlightService } from "@modules/flights/flight.service";
import { CacheService } from "@modules/redis/redis.service";
import { NumberOfTicketsBooked } from "./type/index.type";

@Injectable()
export class TicketService extends BaseServiceAbstract<Ticket> {
    constructor(
        @Inject("TICKET_REPOSITORY")
        private readonly ticketRepository: TicketRepository,
        @Inject(forwardRef(() => BookingService))
        private readonly bookingService: BookingService,
        private readonly menuService: MenuService,
        private readonly serviceHandler: ServiceHandler,
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource,
        private readonly flightService: FlightService,
        private readonly cacheService: CacheService,
    ) {
        super(ticketRepository);
    }

    async createNewTicket(dto: CreateNewTicketDto, queryRunner: QueryRunner, basePrice: number) : Promise<Ticket> {
        let { bookingId, menuIds, serviceIds, ...data} = dto;
        let price = basePrice;
        if(!menuIds) {
            menuIds = [];
        }
        if(!serviceIds) {
            serviceIds = []
        }
        menuIds = [].concat(menuIds);
        serviceIds = [].concat(serviceIds);

        const menus = await Promise.all(
            menuIds.map(async (id) => {
                const menu = await this.menuService.findOneByCondition({ id });
                if (!menu) {
                    return null;
                }
                price += menu.price;
                return menu;
            })
        );
    
        const services = await Promise.all(
            serviceIds.map(async (id) => {
                const service = await this.serviceHandler.findOneByCondition({ id });
                if (!service) {
                    return null;
                }
                price += service.price;
                return service;
            })
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
            services: services,
            price: price
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

    async adjustTicketStatus(id: string, dto: UpdateTicketDto) : Promise<UpdateResult> {
        return await this.ticketRepository.update(id, dto);
    }

    async getTicketInfo(id: string) : Promise<Ticket> {
        const ticket = await this.ticketRepository.findOneByCondition(
            { id },
            { relations: ['menus', 'services', 'booking'] } 
        );

        return ticket;
    }

    async getTicketFromFlightId(flightId: string, queryRunner: QueryRunner): Promise<string[]> {
        const tickets = await queryRunner.manager
            .createQueryBuilder('ticket', 'ticket')
            .leftJoinAndSelect('ticket.booking', 'booking')
            .leftJoinAndSelect('booking.flight', 'flight')
            .where('flight.id = :flightId', { flightId })
            .select(['ticket.seatValue', 'ticket.seatClass'])
            .getMany();
    
        return tickets
                .filter(ticket => ticket.seatValue !== null)
                .map(ticket => `${ticket.seatValue}-${ticket.seatClass}`);
    }

    async getNumberOfFromFlightId(flightId: string, queryRunner: QueryRunner): Promise<NumberOfTicketsBooked> {
        const tickets = await queryRunner.manager
            .createQueryBuilder('ticket', 'ticket')
            .leftJoinAndSelect('ticket.booking', 'booking')
            .leftJoinAndSelect('booking.flight', 'flight')
            .where('flight.id = :flightId', { flightId })
            .select(['ticket.seatValue', 'ticket.seatClass'])
            .getMany();
    
        const seatClassCount = tickets.reduce((acc, ticket) => {
            const seatClass = ticket.seatClass;
            if (acc[seatClass]) {
                acc[seatClass] += 1;
            } else {
                acc[seatClass] = 1;
            }
            return acc;
        }, {});
        
        return {
            numberOfTicketsBasicEconomy: seatClassCount[ESeatClass.BASIC_ECONOMY] || 0,
            numberOfTicketsEconomy: seatClassCount[ESeatClass.ECONOMY] || 0,
            numberOfTicketsPremiumEconomy: seatClassCount[ESeatClass.PREMIUM_ECONOMY] || 0,
            numberOfTicketsBusiness: seatClassCount[ESeatClass.BUSINESS] || 0,
        };
    }

    async checkin(id: string) : Promise<string> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const ticket = await this.ticketRepository.findOneById(
                id,
                {
                    relations: ['booking']
                }
            );
            if(!ticket) {
                throw new NotFoundException('tickets.ticket not found');
            }
            const flight = await this.flightService.getFlightWithDetailInfo(ticket.booking.flight.id);
            const listSeatBooked = await this.getTicketFromFlightId(flight.id, queryRunner);
            const seatLayoutForPlaneType = flight.plane.seatLayoutId.seatLayoutForPlaneType;
            const seatTmpMap = await this.cacheService.getAllSeatInRedis();
            const listSeatRedis = []
            for (const [key, value] of seatTmpMap.entries()) {
                listSeatRedis.push(value);
            }
            if(ticket.seatValue === null) {
                if(seatTmpMap.get(`seat:${ticket.id}`)) {
                    return seatTmpMap.get(`seat:${ticket.id}`); 
                };
                for (const seat of seatLayoutForPlaneType) {
                    if (
                        seat.seatClass === ticket.seatClass &&
                        !listSeatBooked.includes(`${seat.name}-${seat.seatClass}`) &&
                        !listSeatRedis.includes(`${seat.name}-${seat.seatClass}`)
                    ) {
                        await this.cacheService.setCache(
                            `seat:${ticket.id}`,
                            `${seat.name}-${seat.seatClass}`,
                            600
                        )
                        return `${seat.name}-${seat.seatClass}`;
                    }
                }
            } else {
                return ticket.seatValue
            }
            await queryRunner.commitTransaction();
            throw new UnprocessableEntityException('tickets.The return has been made in error.')
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
    }
};