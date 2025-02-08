import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { ProductResponseDto } from "./dtos/product-response.dto";
import {
    ApiResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiExtraModels,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";

@ApiTags("Catalog Products")
@ApiExtraModels(ApiResponse, ProductResponseDto)
@Controller("catalog/products")
export class ProductsClientController {
    constructor(private readonly productsService: ProductsService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            type: "array",
                            $ref: getSchemaPath(ProductResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiQuery({
        name: "search",
        required: false,
        type: String,
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: "sort",
        required: false,
        enum: ["price-asc", "price-desc", "created-desc", "created-asc"],
    })
    @ApiQuery({
        name: "maxPrice",
        required: false,
        type: Number,
    })
    @ApiQuery({
        name: "minPrice",
        required: false,
        type: Number,
    })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                categoryIds: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                    },
                },
            },
        },
    })
    @Post()
    @Serialize(ProductResponseDto)
    async getAllFromCatalog(
        @Query("search") search: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("sort")
        sort:
            | "price-asc"
            | "price-desc"
            | "created-desc"
            | "created-asc" = "created-desc",
        @Query("maxPrice") maxPrice?: number,
        @Query("minPrice") minPrice?: number,
        @Body("categoryIds") categoryIds?: string[],
    ) {
        const { items, totalItems, totalPages } =
            await this.productsService.catalogGetAll(
                search,
                page,
                limit,
                maxPrice,
                minPrice,
                sort,
                categoryIds,
            );

        return createApiOkResponse(items, page, totalItems, totalPages);
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(ProductResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiParam({
        name: "id",
        type: "string",
        format: "uuid",
    })
    @Get(":id")
    @Serialize(ProductResponseDto)
    async catalogGetById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productsService.catalogGetById(id),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(ProductResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                productIds: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "uuid",
                    },
                },
            },
        },
    })
    @Post("ids")
    @Serialize(ProductResponseDto)
    async catalogGetByIds(@Body("productIds") ids: string[]) {
        return createApiOkSingleResponse(
            await this.productsService.catalogGetByIds(ids),
        );
    }
}
