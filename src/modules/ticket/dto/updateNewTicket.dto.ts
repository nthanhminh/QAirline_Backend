import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateNewTicketDto } from './createNewTicket.dto';

export class UpdateTicketDto extends PartialType(
  OmitType(CreateNewTicketDto, ['serviceIds', 'menuIds', 'customerSSID', 'customerEmail'] as const),
) {}
