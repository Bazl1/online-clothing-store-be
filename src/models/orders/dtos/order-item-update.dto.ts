import { ApiProperty } from "@nestjs/swagger";

export class OrderItemUpdateDto {
    @ApiProperty({
        required: false,
    })
    id?: string;

    @ApiProperty()
    productId: string;

    @ApiProperty()
    quantity: number;
}
