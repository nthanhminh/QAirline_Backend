import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAirportDto } from './create-airport.dto';

export class UpdateAirportDto extends PartialType(CreateAirportDto) {


}
