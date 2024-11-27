import { DataSource } from 'typeorm';
import { TicketRepository } from '@repositories/ticket.repository';

export const ticketProviders = [
  {
    provide: 'TICKET_REPOSITORY',
    useFactory: (dataSource: DataSource) => new TicketRepository(dataSource),
    inject: ['DATA_SOURCE'],
  },
];
