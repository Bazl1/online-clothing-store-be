import { AdminGuard } from "@/common/guards/admin.guard";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoryCreateDto } from "./dto/category-create.dto";
import {
    ApiResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { CategoryResponseDto } from "./dto/category-response.dto";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { CategoryUpdateDto } from "./dto/category-update.dto";
import { SessionGuard } from "@/common/guards/session.guard";

@ApiTags("Categories")
@ApiExtraModels(ApiResponse, CategoryResponseDto)
@Controller("categories")
@UseGuards(SessionGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                $ref: getSchemaPath(CategoryResponseDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get()
    @Serialize(CategoryResponseDto)
    async search(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("query") query?: string,
    ) {
        const { categories, totalItems, totalPages } =
            await this.categoriesService.search(query, page, limit);

        return createApiOkResponse(categories, page, totalPages, totalItems);
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CategoryResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get(":id")
    @Serialize(CategoryResponseDto)
    async getById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.categoriesService.getById(id),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CategoryResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Post()
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    async craete(@Body() dto: CategoryCreateDto) {
        return createApiOkSingleResponse(
            await this.categoriesService.create(dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CategoryResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Patch(":id")
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    async update(
        @Param("id", ParseUUIDPipe) categoryId: string,
        @Body() dto: CategoryUpdateDto,
    ) {
        return createApiOkSingleResponse(
            await this.categoriesService.update(categoryId, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CategoryResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Patch(":id")
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    async delete(@Param("id", ParseUUIDPipe) categoryId: string) {
        return createApiOkSingleResponse(
            await this.categoriesService.delete(categoryId),
        );
    }
}
