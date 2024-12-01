import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty()
    newPassword: string;
}
