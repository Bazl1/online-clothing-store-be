import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { OrderItemResponseDto } from "./order-item-response.dto";

export class OrderResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty({ type: OrderItemResponseDto, isArray: true })
    @Expose()
    @Type(() => OrderItemResponseDto)
    items: OrderItemResponseDto[];

    @ApiProperty()
    @Expose()
    country: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    phoneNumber: string;

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

    @ApiProperty()
    @Expose()
    totalPrice: number;

    @ApiProperty()
    @Expose()
    createdAt: Date;
}
