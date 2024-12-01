import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddressCreateOrUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    state: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    country: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    city: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    street: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    house: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    flat: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    floor: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    zip: number;
}
