import { PartialType } from "@nestjs/swagger";
import { CreateNewAirportDto } from "./createNewAiport.dto";

export class UpdateAirportDto extends PartialType(CreateNewAirportDto) {}