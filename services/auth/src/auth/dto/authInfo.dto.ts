import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthInfoDto {
    @IsString()
    @ApiProperty({name: "username"})
    readonly username: string;
    @IsString()
    @ApiProperty({name: "password"})
    readonly password: string;
}