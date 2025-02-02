import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class CategoryUpdateManyActiveDto {
    @ApiProperty({ type: String, isArray: true })
    @IsArray()
    @ArrayNotEmpty()
    ids: number[];

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;
}
