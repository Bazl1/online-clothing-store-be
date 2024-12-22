import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CategoryListResourceDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    title: string;
}
