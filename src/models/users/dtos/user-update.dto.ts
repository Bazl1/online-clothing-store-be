import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class UserUpdateDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsOptional()
    phoneNumber?: string;
}
