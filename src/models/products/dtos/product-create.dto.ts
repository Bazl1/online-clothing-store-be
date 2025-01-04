import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductCreateDto {
    @IsString()
    @ApiProperty()
    title: string;

    @ApiProperty()
    @IsString()
    articul: string;

    @ApiProperty()
    @IsString()
    categoryId: string;

    @ApiProperty()
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

    @ApiProperty()
    @IsOptional()
    discountPrice?: number;
}
