import { PartialType } from "@nestjs/swagger";
import { CreateNewServiceDto } from "./createNewService.dto";

export class ServiceUpdateDto extends PartialType(CreateNewServiceDto) {}