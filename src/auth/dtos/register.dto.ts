import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
} from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password: string;
}
