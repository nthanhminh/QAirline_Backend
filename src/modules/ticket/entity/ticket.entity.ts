import { Entity, Column, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EBookingStatus, ECustomerType } from '@modules/booking/enums/index.enum';
import { Booking } from '@modules/booking/entity/booking.entity';
import { Menu } from '@modules/menu/entity/menu.entity';
import { Services } from '@modules/services/entity/service.entity';
import { ESeatClass } from '@modules/seatsForPlaneType/enums/index.enum';
import { ETicketStatus } from '../enums/index.enum';

@Entity()
export class Ticket extends BaseEntity {
    @Column({
        type: 'float',
        default: 1000
    })
    price: number

    @Column({
        type: 'text',
        default: 'Customer'
    })
    customerName: string

    @Column({
        type: 'enum',
        enum: ECustomerType,
        default: ECustomerType.ADULT
    })
    customerType: ECustomerType

    @Column({
        type: 'text',
        default: ''
    })
    customerSSID: string

    @Column({
        type: 'text',
        default: 'customer@gmail.com'
    })
    customerEmail: string

    @Column({
        type: 'text',       
        nullable: true,     
        default: null,      
    })
    seatValue: string | null;

    @Column({
        type: 'enum',
        enum: ESeatClass
    })
    seatClass: ESeatClass

    @Column({
        type: 'enum',
        enum: EBookingStatus,
        default: EBookingStatus.ACTIVE
    })
    status: EBookingStatus;

    @Column({
        type: 'enum',
        enum: ETicketStatus,
        default: ETicketStatus.NOT_CHECKED_IN
    })
    checkinStatus: ETicketStatus;

    @ManyToOne(() => Booking, (booking) => booking.tickets, { eager: true })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @ManyToMany(() => Menu, (menu) => menu.tickets)
    @JoinTable({
        name: 'menu_tickets',  
        joinColumns: [{ name: 'ticket_id', referencedColumnName: 'id' }], 
        inverseJoinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }] 
    })
    menus: Menu[];

    @ManyToMany(() => Services, (service) => service.tickets)
    @JoinTable({
        name: 'services_tickets',  
        joinColumns: [{ name: 'ticket_id', referencedColumnName: 'id' }], 
        inverseJoinColumns: [{ name: 'services_id', referencedColumnName: 'id' }] 
    })
    services: Services[];
}
