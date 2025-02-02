import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString, ArrayUnique } from "class-validator";

export class DeleteManyUserAdminDto {
    @ApiProperty({
        isArray: true,
        items: {
            type: "number",
        },
    })
    @IsArray()
    @ArrayUnique()
    ids: number[];
}
