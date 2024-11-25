import { PartialType } from "@nestjs/swagger";
import { CreateNewFlightDto } from "./createNewFlight.dto";

export class UpdateFlightDto extends PartialType(CreateNewFlightDto) {}