import { ApiProperty } from "@nestjs/swagger";
import { IsJSON } from "class-validator"; 
import { ServiceItem } from "../type/index.type";

export class ServiceItemDto {
    @ApiProperty({
        required: true,
    })
    @IsJSON()  
    service: ServiceItem;
}
