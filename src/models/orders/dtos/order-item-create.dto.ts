import { ApiProperty } from "@nestjs/swagger";

export class OrderItemCreateDto {
    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;
}
