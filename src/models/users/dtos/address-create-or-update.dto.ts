import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AddressCreateOrUpdateDto {
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
