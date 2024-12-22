import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CategoryCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        description: "Icon file",
        format: "binary",
    })
    icon: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}
