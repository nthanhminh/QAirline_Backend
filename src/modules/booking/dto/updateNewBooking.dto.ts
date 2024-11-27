import { PartialType } from "@nestjs/swagger";
import { CreateNewBookingDto } from "./createNewBooking.dto";

export class UpdateBookingDto extends PartialType(CreateNewBookingDto) {}