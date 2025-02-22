import { ApiProperty } from "@nestjs/swagger";
import { OrderItemUpdateDto } from "./order-item-update.dto";

export class OrderUpdateDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

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
