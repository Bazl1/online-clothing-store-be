import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, IsNotEmpty } from "class-validator";

export class CategoryUpdateManyActiveDto {
    @ApiProperty({ type: [String], isArray: true })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    ids: string[];

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;
}
