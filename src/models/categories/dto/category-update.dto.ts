import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";

export class CategoryUpdateDto {
    @ApiProperty()
    @IsOptional()
    @IsUrl()
    iconUrl?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?: string;
}
