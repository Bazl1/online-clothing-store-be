import { ApiProperty } from "@nestjs/swagger";

export class OrderItemCreateDto {
    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;
}
