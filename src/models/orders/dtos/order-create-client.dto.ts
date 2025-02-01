import { ApiProperty } from "@nestjs/swagger";
import { OrderItemCreateDto } from "./order-item-create.dto";

export class OrderCreateClientDto {
    @ApiProperty()
    country: string;

    @ApiProperty()
    state: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    street: string;

    @ApiProperty()
    house: string;

    @ApiProperty()
    flat: string;

    @ApiProperty()
    floor: string;

    @ApiProperty()
    zip: string;

    @ApiProperty()
    items: OrderItemCreateDto[];
}
