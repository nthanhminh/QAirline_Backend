import { PartialType } from "@nestjs/swagger";
import { CreateNewPriceForFlightDto } from "./createNewPriceForFlight.dto";

export class UpdatePriceForFlightDto extends PartialType(CreateNewPriceForFlightDto) {}