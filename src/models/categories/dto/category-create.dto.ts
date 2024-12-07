import { IsNotEmpty, IsString } from "class-validator";

export class CategoryCreateDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}
