import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CategoryCatalogResourceDto {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty()
    title: string;

    @Expose()
    @ApiProperty()
    iconUrl: string;

    @Expose()
    @ApiProperty()
    description: string;
}
