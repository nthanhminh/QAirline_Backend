import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateNewUserDto } from "./createNewUser.dto";
import { EStatusUser } from "../enums/index.enum";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateUserDto extends PartialType(CreateNewUserDto) {
    @ApiProperty({
        required: true,
        enum: EStatusUser
    })
    @IsEnum(EStatusUser)
    @IsOptional()
    status?: EStatusUser
}