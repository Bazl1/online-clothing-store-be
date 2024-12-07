import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class AddressResponseDto {
    @ApiProperty()
    @Expose()
    country: string;

    @ApiProperty()
    @Expose()
    state: string;

    @ApiProperty()
    @Expose()
    city: string;

    @ApiProperty()
    @Expose()
    street: string;

    @ApiProperty()
    @Expose()
    house: string;

    @ApiProperty()
    @Expose()
    flat: string;

    @ApiProperty()
    @Expose()
    floor: string;

    @ApiProperty()
    @Expose()
    zip: string;
}
