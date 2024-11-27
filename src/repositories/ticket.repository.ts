import { DataSource } from 'typeorm';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { Ticket } from '@modules/ticket/entity/ticket.entity';

export class TicketRepository extends BaseRepositoryAbstract<Ticket> {
  constructor(dataSource: DataSource) {
    super(Ticket, dataSource); 
  }
}
