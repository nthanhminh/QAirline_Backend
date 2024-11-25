import { PartialType } from "@nestjs/swagger";
import { CreateNewSeatClassInfoDto } from "./createNewSeatClassInfo.dto";

export class UpdateSeatClassInfoDto extends PartialType(CreateNewSeatClassInfoDto) {}