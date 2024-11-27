import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Booking } from "./entity/booking.entity";
import { BookingRepository } from "@repositories/booking.repository";
import { CreateNewBookingDto } from "./dto/createNewBooking.dto";
import { UsersService } from "@modules/users/user.services";
import { FlightService } from "@modules/flights/flight.service";
import { UpdateBookingDto } from "./dto/updateNewBooking.dto";
import { DataSource, QueryRunner, UpdateResult } from "typeorm";
import { TicketService } from "@modules/ticket/ticket.service";
import { Ticket } from "@modules/ticket/entity/ticket.entity";
import { EditTicket, TicketBookingItem } from "./type/index.type";
import { SeatLayoutItem } from "@modules/seatsForPlaneType/types/index.type";
import { query } from "express";
import { EditBookingDto } from "./dto/EditBooking.dto";

@Injectable()
export class BookingService extends BaseServiceAbstract<Booking> {
    constructor(
        @Inject('BOOKING_REPOSITORY')
        private readonly bookingRepository: BookingRepository,
        private readonly userService: UsersService,
        private readonly flightService: FlightService,
        @Inject(forwardRef(() =>TicketService))
        private readonly tickeService: TicketService,
        @Inject('DATA_SOURCE') 
        private readonly dataSource: DataSource,
    ) {
        super(bookingRepository);
    }

    // async createNewBooking(dto: CreateNewBookingDto): Promise<Booking> {
    //     const { customerId, flightId, tickets, ...data } = dto;
    //     const {customer, flight } = await this._getCustomerAndFlight(customerId, flightId);
    //     const convertedTickets = await this._handleTickets(tickets,flight.id, flight.plane.seatLayoutId.seatLayoutForPlaneType);
    //     const booking =  await this.bookingRepository.create({
    //         ...data,
    //         flight: flight,
    //         customer: customer
    //     })
    //     await this.addIntoTicketDetail(convertedTickets, booking.id);
    //     return booking;
    // }

    // async _handleTickets(ticket: TicketBookingItem[], flightId: string, seatLayoutForPlaneType: SeatLayoutItem[]) {
    //     let convertedTickets = [].concat(ticket);
    //     const listSeatBooked = await this.tickeService.getTicketFromFlightId(flightId);
    //     convertedTickets.map((ticket : TicketBookingItem) => {
    //         const {seatValue, ...data} = ticket
    //         if(ticket.seatValue) {
    //             return ticket
    //         }
    //         else {
    //             for(let i = 0; i < seatLayoutForPlaneType.length; i++) {
    //                 if(seatLayoutForPlaneType[i].seatClass === ticket.seatClass && !listSeatBooked.includes(`${seatLayoutForPlaneType[i].name}-${seatLayoutForPlaneType[i].seatClass}`)) {
    //                     return {
    //                         ...data,
    //                         seatValue: seatLayoutForPlaneType[i].name
    //                     }
    //                 }
    //             }
    //             return ticket;
    //         }
    //     })
    //     convertedTickets.forEach((ticket : TicketBookingItem) => {
    //         if(listSeatBooked.includes(`${ticket.seatValue}-${ticket.seatClass}`)) {
    //             throw new Error(`${ticket.seatValue} is already booked`);
    //         }
    //     })
    //     return convertedTickets;
    // }

    // async addIntoTicketDetail(ticket: TicketBookingItem[], bookingId: string) {
    //     ticket.forEach(async (ticket: TicketBookingItem) => {
    //         const test = await this.tickeService.createNewTicket({
    //             seatValue: ticket.seatValue,
    //             seatClass: ticket.seatClass,
    //             bookingId: bookingId,
    //             menuIds: ticket.menuIds,
    //             serviceIds: ticket.servicesIds
    //         })
    //         console.log(test);
    //     })
    // }

    // async _getCustomerAndFlight(customerId: string, flightId: string) {
    //     const customer = await this.userService.findUserById(customerId);
    //     if(!customer) {
    //         throw new NotFoundException('users.user not found');
    //     }
    //     const flight = await this.flightService.getFlightWithDetailInfo(flightId);
    //     console.log(flight);
    //     if(!flight) {
    //         throw new NotFoundException('flights.flight not found');
    //     }
    //     return {customer, flight}
    // }


    async createNewBooking(dto: CreateNewBookingDto): Promise<Booking> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
      
        try {
          const { customerId, flightId, tickets, ...data } = dto;
      
          // Lấy thông tin khách hàng và chuyến bay
          const { customer, flight } = await this._getCustomerAndFlight(customerId, flightId);
      
          // Xử lý ghế ngồi
          const convertedTickets = await this._handleTickets(
            tickets,
            flight.id,
            flight.plane.seatLayoutId.seatLayoutForPlaneType,
            queryRunner
          );
      
          // Tạo booking
          const booking = queryRunner.manager.create(Booking, {
            ...data,
            flight: flight,
            customer: customer,
          });
      
          // Lưu booking vào database
          const bookingSaved = await queryRunner.manager.save(booking);

          console.log(bookingSaved);
      
          // Thêm thông tin chi tiết vé
          await this.addIntoTicketDetail(queryRunner, convertedTickets, bookingSaved);
      
          // Commit transaction
          await queryRunner.commitTransaction();
      
          return booking;
        } catch (error) {
          // Rollback transaction nếu có lỗi
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          // Đóng QueryRunner
          await queryRunner.release();
        }
      }
      
      async _handleTickets(
        tickets: TicketBookingItem[],
        flightId: string,
        seatLayoutForPlaneType: SeatLayoutItem[],
        queryRunner: QueryRunner
      ): Promise<TicketBookingItem[]> {
        const listSeatBooked = await this.tickeService.getTicketFromFlightId(flightId, queryRunner);
        const convertedTickets = tickets.map((ticket: TicketBookingItem) => {
          if (ticket.seatValue) {
            return ticket; // Nếu đã có seatValue, không cần xử lý
          }
      
          for (const seat of seatLayoutForPlaneType) {
            if (
              seat.seatClass === ticket.seatClass &&
              !listSeatBooked.includes(`${seat.name}-${seat.seatClass}`)
            ) {
              return { ...ticket, seatValue: seat.name }; // Gán ghế phù hợp
            }
          }
      
          throw new Error(`No available seat for ticket: ${JSON.stringify(ticket)}`);
        });
      
        convertedTickets.forEach((ticket) => {
          if (listSeatBooked.includes(`${ticket.seatValue}-${ticket.seatClass}`)) {
            throw new Error(`${ticket.seatValue} is already booked`);
          }
        });
      
        return convertedTickets;
      }
      
      async addIntoTicketDetail(
        queryRunner: QueryRunner,
        tickets: TicketBookingItem[],
        bookingId: Booking
      ): Promise<void> {
        console.log(bookingId);
        for (const ticket of tickets) {
          const newTicket = await this.tickeService.createNewTicket({
            customerEmail: ticket.customerEmail,
            customerName: ticket.customerName,
            customerType: ticket.customerType,
            customerSSID: ticket.customerSSID,
            bookingId: bookingId,
            menuIds: ticket.menuIds,
            serviceIds: ticket.servicesIds,
            seatValue: ticket.seatValue,
            seatClass: ticket.seatClass
          }, queryRunner);
        }
      }
      
      async _getCustomerAndFlight(customerId: string, flightId: string) {
        const customer = await this.userService.findUserById(customerId);
        if (!customer) {
          throw new NotFoundException('users.user not found');
        }
      
        const flight = await this.flightService.getFlightWithDetailInfo(flightId);
        if (!flight) {
          throw new NotFoundException('flights.flight not found');
        }
      
        return { customer, flight };
      }

    // async updateBooking(id: string, dto: UpdateBookingDto) : Promise<UpdateResult> {
    //     const { customerId, flightId, ...data} = dto;
    //     const customer = await this.userService.findUserById(customerId);
    //     if(!customer) {
    //         throw new NotFoundException('users.user not found');
    //     }
    //     const flight = await this.flightService.findOneByCondition({id:flightId});
    //     if(!flight) {
    //         throw new NotFoundException('flights.flight not found');
    //     }
    //     return await this.bookingRepository.update(id, {
    //         ...data,
    //         flight: flight,
    //         customer: customer
    //     })
    // }

    async updateBooking(id: string, dto: EditBookingDto) : Promise<UpdateResult> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const {ticketsData, flightId, ...data } = dto;
          const booking = await queryRunner.manager.find(Booking, {
            where: {
              id: id,
            },
            relations: ['flight']
          })
          console.log(booking);
          const flight = await this.flightService.findOneByCondition({id: flightId});
          if(!flight) {
            throw new NotFoundException('flights.flight not found');
          }
          await this.updateTicketDetail(ticketsData, flight.id, queryRunner);
          const runnerBookingRepository = queryRunner.manager.getRepository(Booking);
          const updatedBooking = await runnerBookingRepository.update(id, {
            flight: flight,
            ...data,
          });
          await queryRunner.commitTransaction();
          return updatedBooking;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateTicketDetail(tickets: EditTicket[], flightId: string, queryRunner: QueryRunner) {
      let convertedTickets = [].concat(tickets);
      for(const ticket of convertedTickets) {
        const updatedTicket = await this.tickeService.updateTicket({
          seatValue: ticket.seatValue,
          seatClass: ticket.seatClass,
          customerName: ticket.customerName
        }, ticket.ticketId, queryRunner, flightId);
      }
    }
    async deleteBooking(id: string) : Promise<UpdateResult> {
        return await this.bookingRepository.softDelete(id);
    }
}