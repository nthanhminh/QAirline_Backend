import { PartialType } from "@nestjs/swagger";
import { CreateNewPlaneDto } from "./createNewPlane.dto";

export class UpdatePlaneDto extends PartialType(CreateNewPlaneDto){}