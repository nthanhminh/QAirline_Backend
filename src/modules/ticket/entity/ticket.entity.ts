import { Entity, Column, JoinColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '@modules/shared/base/base.entity';
import { EBookingStatus, ECustomerType } from '@modules/booking/enums/index.enum';
import { Booking } from '@modules/booking/entity/booking.entity';
import { Menu } from '@modules/menu/entity/menu.entity';
import { Services } from '@modules/services/entity/service.entity';
import { ESeatClass } from '@modules/seatsForPlaneType/enums/index.enum';

@Entity()
export class Ticket extends BaseEntity {
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
    })
    seatValue: string

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

    @ManyToOne(() => Booking, (booking) => booking.tickets, { eager: true })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @ManyToMany(() => Menu, (menu) => menu.tickets)
    @JoinTable({
        name: 'menu_tickets',  // Custom junction table name
        joinColumns: [{ name: 'ticket_id', referencedColumnName: 'id' }], // Custom join column
        inverseJoinColumns: [{ name: 'menu_id', referencedColumnName: 'id' }] // Custom inverse join column
    })
    menus: Menu[];

    @ManyToMany(() => Services, (service) => service.tickets)
    @JoinTable({
        name: 'services_tickets',  // Custom junction table name
        joinColumns: [{ name: 'ticket_id', referencedColumnName: 'id' }], // Custom join column
        inverseJoinColumns: [{ name: 'services_id', referencedColumnName: 'id' }] // Custom inverse join column
    })
    services: Services[];
}
