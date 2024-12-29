import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

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
    @IsString()
    description: string;

    @ApiProperty({
        description: "Icon file",
        format: "binary",
    })
    images: any[];

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsNumber()
    discountPrice: number;
}
