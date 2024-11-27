import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateNewTicketDto } from './createNewTicket.dto';
import { EBookingStatus } from '@modules/booking/enums/index.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTicketDto extends PartialType(
  OmitType(CreateNewTicketDto, ['serviceIds', 'menuIds', 'customerSSID', 'customerEmail'] as const),
) {
    @ApiProperty({
      required: false,
    })
    @IsEnum(EBookingStatus)
    @IsOptional()
    status?: EBookingStatus
}
