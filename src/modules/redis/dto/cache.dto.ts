import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CacheDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    key: string; 

    @ApiProperty({
        required: true,
    })
    value: any; 

    @ApiProperty({
        required: true,
    })
    @IsOptional()
    ttl?: number 
}