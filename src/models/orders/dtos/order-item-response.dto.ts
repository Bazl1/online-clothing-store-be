import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class OrderItemResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    title: string;

    @ApiProperty()
    @Expose()
    quantity: number;

    @ApiProperty()
    @Expose()
    price: number;

    @ApiProperty()
    @Expose()
    createdAt: Date;
}
