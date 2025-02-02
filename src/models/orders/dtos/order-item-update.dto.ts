import { ApiProperty } from "@nestjs/swagger";

export class OrderItemUpdateDto {
    @ApiProperty({
        required: false,
    })
    id?: number;

    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;
}
