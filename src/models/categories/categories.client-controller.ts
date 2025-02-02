import {
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Query,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import {
    ApiResponse,
    createApiOkResponse,
} from "@/common/interfaces/responses/api-response";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { CategoryResponseDto } from "./dtos/category-response.dto";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { CategoryCatalogResourceDto } from "./dtos/category-catalog-response.dto";

@ApiTags("Catalog Categories")
@ApiExtraModels(ApiResponse, CategoryResponseDto, CategoryCatalogResourceDto)
@Controller("catalog/categories")
export class CategoriesClientController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CategoryCatalogResourceDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiQuery({ name: "limit", required: false, type: Number })
    @Get()
    @Serialize(CategoryCatalogResourceDto)
    async getCatalog(
        @Query("limit", new DefaultValuePipe(0), ParseIntPipe) limit: number,
    ) {
        return createApiOkResponse(
            await this.categoriesService.getCatalog(limit),
        );
    }
}
