import { ESeatClass, ESeatType } from "../enums/index.enum";

export class SeatLayoutItem {
    name: string;
    seatClass: ESeatClass;
    seatType: ESeatType
}

export type SeatMapType = {
    type: string;
    rows: number;
    windowSeats: string[];
    exitRowSeats: string[];
    aisleRowSeats: string[];   
    occupiedRowSeats: string[];
}