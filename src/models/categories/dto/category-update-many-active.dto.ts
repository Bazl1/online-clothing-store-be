import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CategoryUpdateManyActiveDto {
    @ApiProperty({ type: [String], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ids: string[];

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}
