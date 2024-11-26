import { PartialType } from "@nestjs/swagger";
import { CreateNewPriceForSeatTypeDto } from "./createNewPriceForSeatType.dto";

export class UpdatePriceForSeatTypeDto extends PartialType(CreateNewPriceForSeatTypeDto) {}