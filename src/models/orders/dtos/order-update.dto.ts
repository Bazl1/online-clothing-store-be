import { ApiProperty } from "@nestjs/swagger";
import { OrderItemUpdateDto } from "./order-item-update.dto";

export class OrderUpdateDto {
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
    items: OrderItemUpdateDto[];
}
