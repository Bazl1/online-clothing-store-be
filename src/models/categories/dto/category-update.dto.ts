import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CategoryUpdateDto {
    @IsOptional()
    @IsUrl()
    iconUrl?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
