import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayUnique, IsString } from "class-validator";

export class CategoryDeleteManyDto {
    @IsArray()
    @ArrayUnique()
    @ApiProperty({
        isArray: true,
        items: {
            type: "number",
        },
    })
    ids: number[];
}
