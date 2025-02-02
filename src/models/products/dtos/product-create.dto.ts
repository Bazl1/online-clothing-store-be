import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ProductCreateDto {
    @IsString()
    @ApiProperty()
    title: string;

    @ApiProperty()
    @IsString()
    articul: string;

    @ApiProperty()
    @IsString()
    categoryId: number;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Icon file",
        format: "binary",
    })
    images: any[];

    @ApiProperty()
    price: number;

    @ApiProperty({
        required: true,
    })
    @IsOptional()
    discountPrice?: number;
}
