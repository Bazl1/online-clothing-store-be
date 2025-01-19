import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductUpdateDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
    })
    title?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    articul?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    deletedFiles?: string[];

    @ApiProperty({
        description: "Uploaded file",
        format: "binary",
        required: false,
    })
    @IsOptional()
    uploadedFiles?: any[];

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    price?: number;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    discountPrice?: number;
}
