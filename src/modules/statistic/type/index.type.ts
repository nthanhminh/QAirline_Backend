import { Ticket } from "@modules/ticket/entity/ticket.entity";

export type FlightStatistic = {
    flightsThisMonth: number;
    diffrentLastMonth: number;
}

export type FlightStatisticDashboard = {
    Active:  FlightStatistic;
    Done: FlightStatistic;
    Cancelled: FlightStatistic;
}

export type FlightCounts = {
    month: string;
    totalFlights: string;
}

export type TicketCount = {
    period: string;
    totalTickets: number;
}

export type FlightStatisticGroupByAirport = {
    fromairportcode: string;
    fromairportname: string;
    toairportcode: string;
    toairportname: string;
    totalflights: string;
}

export type FlightStatisticByBooking = {
    flightid: string;          
    flightcode: string;       
    departuretime: string;     
    duration: number;        
    totaltickets: string;     
    arrivaltime: string;      
    fromairportname: string;  
    toairportname: string;  
    fromairportcode: string; 
    toairportcode: string;   
}
  
export type FlightBookingDetails = {
    flightId: string;
    flightCode: string;
    departureTime: string;
    duration: number;
    arrivalTime: string;
    fromAirportName: string;
    toAirportName: string;
    fromAirportCode: string;
    toAirportCode: string;
    tickets: Ticket[]; 
}