import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";

export class CategoryUpdateDto {
    @ApiProperty({
        description: "Icon file",
        format: "binary",
    })
    icon: any;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;
}
