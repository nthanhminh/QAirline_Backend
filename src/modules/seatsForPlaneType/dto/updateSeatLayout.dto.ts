import { PartialType } from "@nestjs/swagger";
import { CreateNewSeatLayoutDto } from "./createNewSeatLayout.dto";

export class UpdateSeatLayoutDto extends PartialType(CreateNewSeatLayoutDto) {}