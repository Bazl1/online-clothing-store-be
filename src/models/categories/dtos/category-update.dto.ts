import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryUpdateDto {
    @ApiProperty({
        format: "binary",
        type: "string",
        required: false,
    })
    @IsOptional()
    icon?: any;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
