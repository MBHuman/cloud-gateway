import { ApiProperty } from "@nestjs/swagger";

export class Auth {
    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOiI1MDY3OTgwNS0yMWFjLTQ5NDgtYWQ0My05YWMyN2YwYjE0ODAiLCJpYXQiOjE3MzQxOTEyODMsImV4cCI6MTczNDE5MTM0M30.CYlWSfXmARSh8jKPilCsIkSgV6SwB01h1M6kRRSOqE8",
        name: "accessToken"
    })
    accessToken: string;
    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4iLCJzdWIiOiI1MDY3OTgwNS0yMWFjLTQ5NDgtYWQ0My05YWMyN2YwYjE0ODAiLCJpYXQiOjE3MzQxOTMyNDMsImV4cCI6MTczNDc5ODA0M30.YBCu8ZgeDKttMMXM-hs9RP7g-FUouVsjxb3FC_L-Ans",
        name: "refreshToken"
    })
    refreshToken: string;
}