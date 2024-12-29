import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductUpdateDto {
    @IsString()
    @IsOptional()
    @ApiProperty()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    articul?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: "Deleted file",
        format: "binary",
    })
    @IsOptional()
    deletedFiles?: any[];

    @ApiProperty({
        description: "Uploaded file",
        format: "binary",
    })
    @IsOptional()
    uploadedFiles?: any[];

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    discountPrice?: number;
}
