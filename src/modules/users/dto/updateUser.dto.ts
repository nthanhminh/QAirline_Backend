import { PartialType } from "@nestjs/swagger";
import { CreateNewUserDto } from "./createNewUser.dto";

export class UpdateUserDto extends PartialType(CreateNewUserDto) {
}