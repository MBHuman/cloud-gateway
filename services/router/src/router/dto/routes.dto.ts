import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RoutesDto {
    @IsString()
    @ApiProperty({name: "resourceId"})
    resourceId: string;
    @IsString()
    @ApiProperty({name: "internalUrl"})
    internalUrl: string;
}