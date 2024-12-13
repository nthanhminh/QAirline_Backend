import { Booking } from "@modules/booking/entity/booking.entity";
import { Flight } from "@modules/flights/entity/flight.entity";
import { EFlightStatus } from "@modules/flights/enums/index.enum";
import { Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { FlightBookingDetails, FlightCounts, FlightStatisticByBooking, FlightStatisticDashboard, FlightStatisticGroupByAirport, TicketCount } from "./type/index.type";
import { ETicketStatisticTimeType } from "./enums/index.enum";
import { Ticket } from "@modules/ticket/entity/ticket.entity";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { _getSkipLimit } from "src/helper/pagination.helper.dto";
import { BookingDetailDto } from "./dto/bookingDetail.dto";
import * as moment from "moment";
import { EBookingStatus } from "@modules/booking/enums/index.enum";

export class StatisticService {
    constructor(
        // @Inject('BOOKING_REPOSITORY') 
        // private readonly bookingRepository: BookingRepository,

        // @Inject('FLIGHT_REPOSITORY')
        // private readonly flightRepository: FlightRepository,

        // @Inject('TICKET_REPOSITORY')
        // private readonly ticketRepository: FlightRepository,

        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource
    ) {}

    async getFlightStatistics(status: EFlightStatus) {
        return await Promise.all([
        this.dataSource.getRepository(Flight)
            .createQueryBuilder('flight')
            .where('DATE_TRUNC(\'month\', flight.departureTime) = DATE_TRUNC(\'month\', CURRENT_DATE)')
            .andWhere('flight.status = :status', { status: status })
            .getCount(),
        
        this.dataSource.getRepository(Flight)
            .createQueryBuilder('flight')
            .where('DATE_TRUNC(\'month\', flight.departureTime) = DATE_TRUNC(\'month\', CURRENT_DATE - INTERVAL \'1 month\')')
            .andWhere('flight.status = :status', { status: status })
            .getCount(),
        ]);
    }

    async getTotalRevenue() {
        const [thisMonthData, lastMonthData] =  await Promise.all([ 
            this.dataSource
            .getRepository(Flight)
            .createQueryBuilder('flight')
            .leftJoin('flight.bookings', 'flight_bookings')
            .leftJoin(
                'flight_bookings.tickets',
                'flight_bookings_tickets',
                'flight_bookings_tickets.status = :activeStatus',
                { activeStatus: EBookingStatus.ACTIVE }
            )
            .select('SUM(flight_bookings_tickets.price)', 'totalPrice') 
            .where('DATE_TRUNC(\'month\', flight.departureTime) = DATE_TRUNC(\'month\', CURRENT_DATE)') // Chuyến bay trong tháng hiện tại
            .getRawOne(),
            this.dataSource
            .getRepository(Flight)
            .createQueryBuilder('flight')
            .leftJoin('flight.bookings', 'flight_bookings')
            .leftJoin(
                'flight_bookings.tickets',
                'flight_bookings_tickets',
                'flight_bookings_tickets.status = :activeStatus',
                { activeStatus: EBookingStatus.ACTIVE } 
            )
            .select('SUM(flight_bookings_tickets.price)', 'totalPrice') 
            .where('DATE_TRUNC(\'month\', flight.departureTime) = DATE_TRUNC(\'month\', CURRENT_DATE - INTERVAL \'1 month\')')
            .getRawOne()
        ])
        console.log(thisMonthData, lastMonthData);
        const totalPriceThisMonth = thisMonthData["totalPrice"] ?? 0;
        const totalPriceLastMonth = lastMonthData["totalPrice"] ?? 0;
        return [totalPriceThisMonth, totalPriceLastMonth];
    }

    async getFlightsCountByMonth() {
        const now = new Date();
        const eightMonthsAgo = new Date();
        eightMonthsAgo.setMonth(now.getMonth() - 8);
    
        const result: FlightCounts[] = await this.dataSource.getRepository(Flight)
            .createQueryBuilder('flight')
            .select("TO_CHAR(flight.departureTime, 'YYYY-MM') AS month, COUNT(*) AS totalFlights")
            .where("flight.departureTime >= :eightMonthsAgo", { eightMonthsAgo })
            .groupBy("TO_CHAR(flight.departureTime, 'YYYY-MM')")
            .orderBy("month", "DESC")
            .getRawMany();

        const months = [];
        let currentMonth = new Date(eightMonthsAgo);
        while (currentMonth <= now) {
            months.push(currentMonth.toISOString().slice(0, 7));
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
    
        const finalResult = months.map(month => {
            const found = result.find((item: FlightCounts) =>{
                return item.month === month
            });
            return {
                month,
                totalFlights: found ? parseInt(found["totalflights"], 10) : 0
            };
        });
    
        return finalResult;
    }    

    async getAllTicket(): Promise<number> {
        const count = await this.dataSource
          .getRepository(Ticket)
          .createQueryBuilder('ticket')
          .where('ticket.status = :status', { status: EBookingStatus.ACTIVE })
          .getCount();
        return count;
    }
      
    async getAllFlight(): Promise<number> {
        const count = await this.dataSource
          .getRepository(Flight)
          .createQueryBuilder('flight')
          .where('flight.status != :status', { status: EFlightStatus.CANCELLED })
          .getCount();
        return count;
    }
  

    async getFlightStatisticDashboard() : Promise<FlightStatisticDashboard> {
        const [
            [flightsThisMonthActive, flightsLastMonthActive],
            [flightsThisMonthDone, flightsLastMonthDone],
            [flightsThisMonthCancelled, flightsLastMonthCancelled],
            [totalRevenueThisMonth, totalRevenueLastMonth],
        ] = await Promise.all([
            this.getFlightStatistics(EFlightStatus.ACTIVE),
            this.getFlightStatistics(EFlightStatus.DONE),
            this.getFlightStatistics(EFlightStatus.CANCELLED),
            this.getTotalRevenue()
        ]);

        return {
            "ACTIVE": {
                flightsThisMonth: flightsThisMonthActive,
                diffrentLastMonth: this._getFlightStatisticsConsider(flightsThisMonthActive, flightsLastMonthActive)
            },
            "DONE": {
                flightsThisMonth: flightsLastMonthDone,
                diffrentLastMonth: this._getFlightStatisticsConsider(flightsThisMonthDone, flightsLastMonthDone),
            },
            "CANCELLED": {
                flightsThisMonth: flightsLastMonthCancelled,
                diffrentLastMonth: this._getFlightStatisticsConsider(flightsThisMonthCancelled, flightsLastMonthCancelled),
            },
            "REVENUE": {
                flightsThisMonth: totalRevenueThisMonth,
                diffrentLastMonth: this._getFlightStatisticsConsider(totalRevenueThisMonth, totalRevenueLastMonth)
            }
            
        }
    }

    _getFlightStatisticsConsider(flightsThisMonth: number, flightsLastMonth: number) : number {
        if(flightsLastMonth === 0) {
            if(flightsThisMonth > 0) {
                return 100;
            } else {
                return 0;
            }
        } else {
            const diff = flightsThisMonth * 100.0 / flightsLastMonth;
            return diff - 100;
        }
    }

    async getTicketStatistic(timeType: ETicketStatisticTimeType) : Promise<TicketCount[]> {
        const now = new Date();
        let startDate: Date = this._getStartDateFromTimeType(timeType);
        const periods: string[] = this._getDataLabelFromTimeType(timeType, startDate);

        const result = await this.dataSource
            .getRepository(Booking)
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.tickets', 'ticket')
            .select([
                timeType === ETicketStatisticTimeType.YEAR
                    ? "TO_CHAR(booking.bookingDate, 'YYYY-MM') AS period"
                    : "TO_CHAR(booking.bookingDate, 'YYYY-MM-DD') AS period",
                'COUNT(ticket.id) AS totalTickets'
            ])
            .where("booking.bookingDate BETWEEN :startDate AND :now", { startDate, now })
            .groupBy(
                timeType === ETicketStatisticTimeType.YEAR
                    ? "TO_CHAR(booking.bookingDate, 'YYYY-MM')"
                    : "TO_CHAR(booking.bookingDate, 'YYYY-MM-DD')"
            )
            .orderBy("period", "ASC")
            .getRawMany();
    
        const resultMap = new Map(result.map(item => [item.period, parseInt(item["totaltickets"], 10)]));
        const finalResult = periods.map(period => ({
            period,
            totalTickets: resultMap.get(period) || 0 
        }));

        return finalResult;
    }    

    async getFlightStatisticsGroupbyAirport() : Promise<FlightStatisticGroupByAirport[]> {
        const result = await this.dataSource
            .getRepository(Flight)
            .createQueryBuilder('flight')
            .leftJoinAndSelect('flight.fromAirport', 'fromAirport') 
            .leftJoinAndSelect('flight.toAirport', 'toAirport')    
            .select([
                'fromAirport.code AS fromAirportCode',  
                'fromAirport.name AS fromAirportName',  
                'toAirport.code AS toAirportCode',       
                'toAirport.name AS toAirportName',       
                'COUNT(flight.id) AS totalFlights'       
            ])
            .groupBy('fromAirport.code')               
            .addGroupBy('fromAirport.name')             
            .addGroupBy('toAirport.code')              
            .addGroupBy('toAirport.name')              
            .orderBy('totalFlights', 'DESC') 
            .limit(5)            
            .getRawMany();

        return result;
    }    

    async getFlightStatisticByBooking(dto: PaginationDto) : Promise<FlightStatisticByBooking[]> {
        const {page, pageSize} = dto;
        const { skip, limit } = _getSkipLimit({page, pageSize});
        const result = await this.dataSource
                .getRepository(Ticket)
                .createQueryBuilder('ticket')
                .leftJoin('ticket.booking', 'booking') 
                .leftJoin('booking.flight', 'flight')
                .leftJoin('flight.fromAirport', 'fromAirport') 
                .leftJoin('flight.toAirport', 'toAirport') 
                .select([
                    'flight.id AS flightId',             
                    'flight.flightCode AS flightCode',       
                    "TO_CHAR(flight.departureTime, 'YYYY-MM-DD HH24:MI') AS departureTime",
                    'flight.duration AS duration',         
                    'COUNT(ticket.id) AS totalTickets',    
                    "TO_CHAR((flight.departureTime + (flight.duration * INTERVAL '1 second')), 'YYYY-MM-DD HH24:MI') AS arrivalTime",
                    'fromAirport.name AS fromAirportName',
                    'toAirport.name AS toAirportName',
                    'fromAirport.code AS fromAirportCode',
                    'toAirport.code AS toAirportCode',
                ])
                .where('flight.status = :status', { status: 'ACTIVE' })
                .groupBy('flight.id')                     
                .addGroupBy('flight.flightCode')                
                .addGroupBy('flight.departureTime')      
                .addGroupBy('flight.duration')          
                .addGroupBy('fromAirport.name')           
                .addGroupBy('toAirport.name')  
                .addGroupBy('fromAirport.code')     
                .addGroupBy('toAirport.code')      
                .orderBy('totalTickets', 'DESC') 
                .skip(skip)      
                .limit(limit)    
                .getRawMany();
        return result;
    }

    async getBookingDetails(dto: BookingDetailDto): Promise<FlightBookingDetails[]> {
        const { page, pageSize, flightCode, status, departureTime} = dto
        const { skip, limit } = _getSkipLimit({page, pageSize});
        const queryBuilder = this.dataSource
            .getRepository(Flight) 
            .createQueryBuilder('flight')  
            .leftJoinAndSelect('flight.fromAirport', 'fromAirport')  
            .leftJoinAndSelect('flight.toAirport', 'toAirport')  
            .leftJoinAndSelect('flight.bookings', 'bookings') 
            .leftJoinAndSelect('bookings.tickets', 'tickets')  
            .select([
                'flight.id AS flightId', 
                'flight.flightCode AS flightCode', 
                "TO_CHAR(flight.departureTime AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') AS departureTime",
                'flight.duration AS duration', 
                "TO_CHAR((flight.departureTime + (flight.duration * INTERVAL '1 second')) AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI') AS arrivalTime",
                'fromAirport.name AS fromAirportName', 
                'toAirport.name AS toAirportName', 
                'fromAirport.code AS fromAirportCode', 
                'toAirport.code AS toAirportCode',
                'json_agg(tickets) FILTER(WHERE tickets.id IS NOT NULL) AS flightTickets'  
            ])
            .where('flight.id IS NOT NULL')
            .orderBy('flight.createdAt', 'DESC');  

        if (flightCode) {
            queryBuilder.andWhere('flight.flightCode = :flightCode', { flightCode });
        }

        if (status) {
            queryBuilder.andWhere('flight.status = :status', { status });
        }

        if (departureTime) {
            const departureDateMoment = moment(departureTime, 'DD-MM-YYYY').startOf('day');
            const departureDateUTC = departureDateMoment.utc().toDate(); 
            queryBuilder.andWhere('DATE(flight.departureTime) = DATE(:departureTime)', { departureTime: departureDateUTC });
        }

        queryBuilder.groupBy('flight.id') 
            .addGroupBy('flight.flightCode')
            .addGroupBy('flight.departureTime')
            .addGroupBy('flight.duration')
            .addGroupBy('fromAirport.name')
            .addGroupBy('toAirport.name')
            .addGroupBy('fromAirport.code')
            .addGroupBy('toAirport.code')
            
        queryBuilder.orderBy('flight.departureTime', 'ASC')
            .orderBy('flight.id', 'ASC') 
            .skip(skip)
            .limit(limit);  

        const result = await queryBuilder.getRawMany();

        return result;
    }

    _getStartDateFromTimeType(timeType: ETicketStatisticTimeType) {
        const now = new Date();
        let startDate: Date;
        if (timeType === ETicketStatisticTimeType.WEEK) {
            startDate = new Date();
            startDate.setDate(now.getDate() - 6); // 7 ngày 
        } else if (timeType === ETicketStatisticTimeType.MONTH) {
            startDate = new Date();
            startDate.setDate(now.getDate() - 30); // 31 ngày 
        } else if (timeType === ETicketStatisticTimeType.YEAR) {
            startDate = new Date();
            startDate.setFullYear(now.getFullYear() - 1); // 12 tháng 
        } else {
            throw new Error('Invalid timeType');
        }
        return startDate;
    }

    _getDataLabelFromTimeType(timeType:ETicketStatisticTimeType, startDate: Date) : string[] {
        const periods: string[] = [];
        const current = new Date(startDate);
        const now = new Date();
        while (current <= now) {
            if (timeType === ETicketStatisticTimeType.YEAR) {
                periods.push(
                    `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`
                ); 
                current.setMonth(current.getMonth() + 1); 
            } else {
                periods.push(
                    `${current.getFullYear()}-${(current.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`
                ); 
                current.setDate(current.getDate() + 1); 
            }
        }
        return periods;
    }   
}