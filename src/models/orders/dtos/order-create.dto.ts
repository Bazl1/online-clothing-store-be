import { ApiProperty } from "@nestjs/swagger";
import { OrderItemCreateDto } from "./order-item-create.dto";

export class OrderCreateDto {
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

    @ApiProperty({ required: false })
    house?: string;

    @ApiProperty({ required: false })
    flat?: string;

    @ApiProperty({ required: false })
    floor?: string;

    @ApiProperty({ required: false })
    zip?: string;

    @ApiProperty()
    items: OrderItemCreateDto[];
}
