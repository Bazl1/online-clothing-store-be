import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CategoryUpdateDto {
    @ApiProperty({
        description: "Icon file",
        format: "binary",
    })
    @IsOptional()
    icon?: any;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;
}
