import { CategoryResponseDto } from "@/models/categories/dtos/category-response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";

export class ProductResponseDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    articul: string;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    description: string;

    @Expose()
    @ApiProperty()
    price: number;

    @Expose()
    @ApiProperty()
    discountPrice: number;

    @Expose()
    @ApiProperty()
    isActive: boolean;

    @Expose()
    @ApiProperty({ type: CategoryResponseDto })
    @Type(() => CategoryResponseDto)
    category: CategoryResponseDto;

    @Expose()
    @ApiProperty()
    images: string[];

    @Expose()
    @ApiProperty()
    createdAt: Date;

    @Expose()
    @ApiProperty()
    updatedAt: Date;
}
