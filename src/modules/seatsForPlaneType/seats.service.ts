import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SeatRepository } from "@repositories/seat.repository";
import { BaseServiceAbstract } from "src/services/base/base.abstract.service";
import { Seat } from "./entity/seat.entity";
import { CreateNewSeatLayoutDto } from "./dto/createNewSeatLayout.dto";
import { DataSource, UpdateResult } from "typeorm";
import { UpdateSeatLayoutDto } from "./dto/updateSeatLayout.dto";
import { EPlaneType } from "@modules/planes/enums/index.enum";
import { SeatLayoutItem, SeatMapType } from "./types/index.type";
import { ESeatClass, ESeatType } from "./enums/index.enum";
import { FlightService } from "@modules/flights/flight.service";
import { TicketService } from "@modules/ticket/ticket.service";
import { type } from "os";

@Injectable()
export class SeatService extends BaseServiceAbstract<Seat> {
    constructor(
        @Inject('SEAT_REPOSITORY')
        private readonly seatRepository: SeatRepository,
        @Inject(forwardRef(() => FlightService))
        private readonly flightService: FlightService,
        private readonly ticketService: TicketService,
        @Inject('DATA_SOURCE')
        private readonly dataSource: DataSource
    ) {
        super(seatRepository);
    }

    async createSeatLayout(dto: CreateNewSeatLayoutDto) : Promise<Seat> {
        return await this.seatRepository.create(dto);
    }

    async findOneByType(type: EPlaneType) : Promise<Seat> {
        return await this.seatRepository.findOneByCondition({
            planeType: type
        });
    }

    async getSeatDataForFlight(flightId: string): Promise<SeatMapType[]> {
        const flight = await this.flightService.findOne(flightId);
        if(!flight) {
            throw new NotFoundException(`flights.flight not found`);
        }
        const seat = await this.seatRepository.findOneByCondition({
            planeType: flight.plane.type
        });
        const queryRunner = this.dataSource.createQueryRunner();
        const bookedSeats: string[] = await this.ticketService.getTicketFromFlightId(flight.id,queryRunner);
        const bookedSeatType: {
            [type: string]: string[],         
        } = {
            [`${ESeatClass.BUSINESS}`]: [],
            [`${ESeatClass.PREMIUM_ECONOMY}`]: [],
            [`${ESeatClass.ECONOMY}`]: [],
            [`${ESeatClass.BASIC_ECONOMY}`]: [],
        }
        for(const bookedSeat of bookedSeats) {
            const seatInfo = bookedSeat.split('-');
            const seatValue = seatInfo[0];
            const seatClass = seatInfo[1];
            bookedSeatType[seatClass].push(seatValue);
        }
        const seatLayoutItems = seat.seatLayoutForPlaneType;
    
        const groupedBySeatType = seatLayoutItems.reduce((acc, seat) => {
     
            if (!acc[seat.seatClass]) {
                acc[seat.seatClass] = [];
            }
    
            acc[seat.seatClass].push(seat);
            return acc;
        }, {} as { [key in ESeatType]?: SeatLayoutItem[] });
    
        const data = Object.keys(groupedBySeatType).map((seatType) => {
            const seats:SeatLayoutItem[]  = groupedBySeatType[seatType];
            const mp = new Map<string, number>();
            const windowSeats = [];
            const exitRowSeats = [];
            const aisleRowSeats = [];
            for (const seat of seats) {
                const startedValue = seat.name.slice(0,1);
                const currentValueOfMap = mp.get(startedValue) || 0;
                mp.set(startedValue, currentValueOfMap + 1);
                switch (seat.seatType) {
                    case ESeatType.AISLE_SEAT:
                        aisleRowSeats.push(seat.name);
                        break;
                    case ESeatType.EXIT_ROW_SEAT:
                        exitRowSeats.push(seat.name);
                        break;
                    case ESeatType.WINDOW_SEAT:
                        windowSeats.push(seat.name);
                        break;
                }

            }

            return {
                type: seatType,
                windowSeats: windowSeats,
                aisleRowSeats: aisleRowSeats,
                exitRowSeats: exitRowSeats,
                rows: mp.get("A"),
                occupiedRowSeats: bookedSeatType[seatType],
        }});
    
        return data;
    }

    getRowsNumberForType(seats: string[]): number {
        const uniqueValue = new Set();
        for(const seat of seats) {
            const startedValue = seat.slice(0,1);
            uniqueValue.add(startedValue);
        }
        return uniqueValue.size;
    }

    async updateSeatLayout(id: string, dto: UpdateSeatLayoutDto) : Promise<UpdateResult> {
        return await this.seatRepository.update(id, dto);
    }

    async deleteSeatLayout(id: string) : Promise<UpdateResult> {
        return await this.seatRepository.softDelete(id);
    }

    async checkSeatLayoutExists(id: string) : Promise<Seat> {
        const seatLayout = await this.seatRepository.findOneById(id);
        if (!seatLayout) {
            throw new NotFoundException('seats.Seat layout not found');
        }
        return seatLayout;
    }
}
