import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ResourcesDto {
    @IsString()
    @ApiProperty({name: "resource"})
    resource: string
}