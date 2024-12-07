import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber } from "class-validator";

export class UpdateUserWithAddressDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phoneNumber?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email?: string;

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
