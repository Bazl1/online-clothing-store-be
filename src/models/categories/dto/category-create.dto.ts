import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CategoryCreateDto {
    @IsNotEmpty()
    @IsUrl()
    iconUrl: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
