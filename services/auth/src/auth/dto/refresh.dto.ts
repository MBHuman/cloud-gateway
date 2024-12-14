import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshDto {
    @IsString()
    @ApiProperty({name: "refreshToken"})
    refreshToken: string
}