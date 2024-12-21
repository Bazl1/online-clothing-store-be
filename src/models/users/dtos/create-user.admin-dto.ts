import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsPhoneNumber,
    IsOptional,
    IsNotEmpty,
} from "class-validator";

export class CreateUserAddressAdminDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    state?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    country?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    city?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    street?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    house?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    flat?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    floor?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    zip?: string;
}
