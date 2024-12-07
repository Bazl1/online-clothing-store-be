import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CategoryResponseDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    isActive: boolean;

    @Expose()
    @ApiProperty()
    iconUrl: string;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    description: string;
}
