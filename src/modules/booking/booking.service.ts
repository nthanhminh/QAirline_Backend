import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
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
import { CancelTicket, EditTicket, TicketBookingItem } from "./type/index.type";
import { SeatLayoutItem } from "@modules/seatsForPlaneType/types/index.type";
import { query } from "express";
import { EditBookingDto } from "./dto/EditBooking.dto";
import { CancelTicketDto } from "./dto/cancelTicket.dto";
import { EBookingStatus, ECheckType } from "./enums/index.enum";
import { convertNowToTimezone } from "src/helper/time.helper";
import { ETimeZone } from "src/common/enum/index.enum";
import * as moment from "moment";
import { SeatClassPrice } from "@modules/flights/type/index.type";
import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { News } from "@modules/news/entity/news.entity";

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
      
          const seatClassPrices: SeatClassPrice[] = this.flightService.getSeatClassPriceForFlightUsingFlightsPrice(flight.flightsPrice);

          // console.log(flight);

          // Xử lý ghế ngồi
          const convertedTickets = await this._handleTickets(
            tickets,
            flight.id,
            // flight.plane.seatLayoutId.seatLayoutForPlaneType,
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
      
          // Thêm thông tin chi tiết vé
          await this.addIntoTicketDetail(queryRunner, convertedTickets, bookingSaved, seatClassPrices, flight.toAirport.discounts);
      
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
        // seatLayoutForPlaneType: SeatLayoutItem[],
        queryRunner: QueryRunner,
      ): Promise<TicketBookingItem[]> {
        const listSeatBooked = await this.tickeService.getTicketFromFlightId(flightId, queryRunner);
        let {
          numberOfBusinessSeats,
          numberOfPreminumEconomySeats,
          numberOfEconomySeats,
          numberOfBasicSeats
        } = await this.flightService.getNumberOfSeatInfoForFlight(flightId, queryRunner);
        const convertedTickets = tickets.map((ticket: TicketBookingItem) => {
          switch (ticket.seatClass) {
            case ESeatClass.BUSINESS:
              if(numberOfBusinessSeats <=0 ) {
                throw new Error(`No available seat for ticket: ${ticket.seatClass}`);
              }
              numberOfBusinessSeats--;
              break;
            case ESeatClass.PREMINUM_ECONOMY:
              if(numberOfPreminumEconomySeats <=0 ) {
                throw new Error(`No available seat for ticket: ${ticket.seatClass}`);
              }
              numberOfPreminumEconomySeats--;
              break;
            case ESeatClass.ECONOMY:
              if(numberOfEconomySeats <=0 ) {
                throw new Error(`No available seat for ticket: ${ticket.seatClass}`);
              }
              numberOfEconomySeats--;
              break;
            case ESeatClass.BASIC_ECONOMY:
              if(numberOfBasicSeats <=0 ) {
                throw new Error(`No available seat for ticket: ${ticket.seatClass}`);
              }
              numberOfBasicSeats--;
              break;
          }
          if(ticket.seatValue) {
            if (listSeatBooked.includes(`${ticket.seatValue}-${ticket.seatClass}`)) {
              throw new Error(`${ticket.seatValue} is already booked`);
            } else {
              listSeatBooked.push(`${ticket.seatValue}-${ticket.seatClass}`);
            }
          }
          return ticket;
          // if (ticket.seatValue) {
          //   return ticket; // Nếu đã có seatValue, không cần xử lý
          // }
      
          // for (const seat of seatLayoutForPlaneType) {
          //   if (
          //     seat.seatClass === ticket.seatClass &&
          //     !listSeatBooked.includes(`${seat.name}-${seat.seatClass}`)
          //   ) {
          //     return { ...ticket, seatValue: seat.name }; // Gán ghế phù hợp
          //   }
          // }
      
          // throw new Error(`No available seat for ticket: ${JSON.stringify(ticket)}`);
        });
      
        // convertedTickets.forEach((ticket) => {
        //   if (listSeatBooked.includes(`${ticket.seatValue}-${ticket.seatClass}`)) {
        //     throw new Error(`${ticket.seatValue} is already booked`);
        //   }
        // });
      
        return convertedTickets;
      }
      
      async addIntoTicketDetail(
        queryRunner: QueryRunner,
        tickets: TicketBookingItem[],
        bookingId: Booking,
        seatClassPrices: SeatClassPrice[],
        discounts: News[],
      ): Promise<void> {
        for (const ticket of tickets) {
          let basePrice = this._getSeatClassPriceForTicket(seatClassPrices, ticket.seatClass);
          console.log('basePriceBooking:', basePrice);
          basePrice = this._handleBasePriceDiscount(discounts, basePrice);
          console.log('basePriceBooking after:', basePrice);
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
          }, queryRunner, basePrice);
        }
      }
      
      _handleBasePriceDiscount(discounts: News[], basePrice: number): number {
        let basePriceHandled = basePrice;
        console.log(discounts)
        for(const discount of discounts) {
          if(!discount.endTime) {
            continue;
          } else {
            const now = convertNowToTimezone(ETimeZone.UTC).toDate();
            const endTime = new Date(discount.endTime);
            if(endTime < now) {
              continue;
            }
          }
          if(discount.percentDiscount > 0) {
            basePriceHandled = basePriceHandled * (100 - discount.percentDiscount) * 1.0 / 100;
          }
          if (discount.cashDiscount > 0) {
            basePriceHandled = basePriceHandled - discount.cashDiscount;
          }
        }
        return basePriceHandled;
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
          const booking = await queryRunner.manager.findOne(Booking, {
            where: {
              id: id,
            },
            relations: ['flight']
          })
          if(!booking) {
            throw new NotFoundException('bookings.booking not found');
          }
          const flight = await this.flightService.findOneByCondition({id: flightId});
          if(!flight) {
            throw new NotFoundException('flights.flight not found');
          }
          const checkCanEditBooking = this._checkCanEditBooking(booking.flight.departureTime, ECheckType.UPDATE);
          if(checkCanEditBooking) {
            throw new BadRequestException('bookings.You cannot cancel this ticket because it is too late.');
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

    async cancelTicketDetail(tickets: CancelTicket[], queryRunner: QueryRunner) {
      let convertedTickets = [].concat(tickets);
      for(const ticket of convertedTickets) {
        const updatedTicket = await this.tickeService.cancelTicket(ticket.ticketId, queryRunner);
      }
    }

    async cancelTicket(id: string, dto: CancelTicketDto) : Promise<string> {
      const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          const {ticketsData, ...data } = dto;
          const booking = await queryRunner.manager.findOne(Booking, {
            where: {
              id: id,
            },
            relations: ['flight', 'tickets']
          })
          if(!booking) {
            throw new NotFoundException('bookings.booking not found');
          }
          const checkCanEditBooking = this._checkCanEditBooking(booking.flight.departureTime, ECheckType.CANCELLED);
          if(checkCanEditBooking) {
            throw new BadRequestException('bookings.You cannot cancel this ticket because it is too late.');
          }
          await this.cancelTicketDetail(ticketsData, queryRunner);
          const checkCancelBooking = this._checkCancelBooking(booking.tickets, ticketsData);
          if(checkCancelBooking) {
            const runnerBookingRepository = queryRunner.manager.getRepository(Booking);
            const updatedBooking = await runnerBookingRepository.update(id, {
              status: EBookingStatus.CANCELLED
            });
          }
          await queryRunner.commitTransaction();
          return 'bookings.cancel successfully';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('bookings.cancel error');
        } finally {
            await queryRunner.release();
        }
    }

    _checkCancelBooking(tickets: Ticket[], ticketsData: CancelTicket[]) : boolean {
        const convertedTickets:Ticket[] = [].concat(tickets);
        const convertedTicketsData: CancelTicket[] = [].concat(convertedTickets);
        const mp: Map<string, number> = new Map();
        for (const ticket of convertedTickets) {
          mp.set(ticket.id, 1);
        }
        for (const ticketData of convertedTicketsData) {
          if(mp.has(ticketData.ticketId)) {
            mp.delete(ticketData.ticketId);
          } else {
            throw new BadRequestException('tickets.ticket not found');
          }
        }
        return mp.size === 0;
    }

    _checkCanEditBooking(departureTime: Date, checkType: ECheckType): boolean {
        const now = convertNowToTimezone(ETimeZone.UTC);
        const convertedDepartureTime = moment(departureTime)
        const diffHour = convertedDepartureTime.diff(now, 'hour'); // Directly use 'diff' to get the difference in hours
    
        switch (checkType) {
            case ECheckType.UPDATE:
                if (diffHour > 3) {
                    return true;
                }
                break;
            case ECheckType.CANCELLED:
                if (diffHour > 72) {
                    return true;
                }
                break;
        }
        return false;
    }
    

    async deleteBooking(id: string) : Promise<UpdateResult> {
        return await this.bookingRepository.softDelete(id);
    }

    _getSeatClassPriceForTicket(seatClassPrices: SeatClassPrice[], seatClassName: ESeatClass): number {
        for (const seatClassPrice of seatClassPrices) {
            if (seatClassPrice.name === seatClassName) {
                return seatClassPrice.price;
            }
        }
        return 0; 
    }

    async getBookingDetails(id: string): Promise<Booking> {
      const booking = await this.dataSource
        .getRepository(Booking)
        .createQueryBuilder('booking')
        .leftJoinAndSelect('booking.flight', 'flight') 
        .leftJoinAndSelect('booking.tickets', 'tickets') 
        .leftJoinAndSelect('tickets.menus', 'menus') 
        .leftJoinAndSelect('tickets.services', 'services') 
        .where('booking.id = :id', { id }) 
        .getOne();
    
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
    
      return booking;
    }
    
}