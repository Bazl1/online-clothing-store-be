import { ProductResponseDto } from "@/models/products/dtos/product-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class OrderItemResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty({ type: ProductResponseDto })
    @Expose()
    @Type(() => ProductResponseDto)
    product: ProductResponseDto;

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
