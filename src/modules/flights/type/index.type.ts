import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";

export type SeatClassPrice = {
    name: ESeatClass;
    price: number;
}

export type NumberOfSeatsForFlight = {
    numberOfBusinessSeats: number;
    numberOfPreminumEconomySeats: number;
    numberOfEconomySeats: number;
    numberOfBasicSeats: number;
}