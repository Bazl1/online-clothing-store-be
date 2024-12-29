import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ArrayUnique, IsString } from "class-validator";

export class CategoryDeleteManyDto {
    @IsArray()
    @ArrayUnique()
    @IsString({ each: true })
    @ApiProperty({
        isArray: true,
        items: {
            type: "string",
            format: "uuid",
        },
        description: "Array of user ids",
        example: ["5f4f6f5e6c0e6c001f2e4a3d", "5f4f6f5e6c0e6c001f2e4a3e"],
    })
    ids: string[];
}
