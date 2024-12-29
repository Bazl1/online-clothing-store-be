import { ApiProperty } from "@nestjs/swagger";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class CategoryUpdateManyActiveDto {
    @ApiProperty({ type: String, isArray: true })
    @IsUUID("4", { each: true })
    @IsArray()
    @ArrayNotEmpty()
    ids: string[];

    @ApiProperty()
    @IsNotEmpty()
    isActive: boolean;
}
