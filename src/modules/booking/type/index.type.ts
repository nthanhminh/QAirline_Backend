import { ESeatClass } from "@modules/seatsForPlaneType/enums/index.enum";
import { ECustomerType } from "../enums/index.enum";

export class TicketBookingItem {
    customerName: string;
    customerType: ECustomerType;
    customerSSID: string;
    customerEmail: string;
    seatValue: string;
    seatClass: ESeatClass;
    menuIds: string[];
    servicesIds: string[];
}

export class EditTicket {
    ticketId: string;
    seatValue: string;
    seatClass: ESeatClass;
    customerName: string;
}