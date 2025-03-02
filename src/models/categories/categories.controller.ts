import { AdminGuard } from "@/common/guards/admin.guard";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoryCreateDto } from "./dtos/category-create.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { CategoryResponseDto } from "./dtos/category-response.dto";
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiExtraModels,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { CategoryUpdateDto } from "./dtos/category-update.dto";
import { SessionGuard } from "@/common/guards/session.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CategoryDeleteManyDto } from "./dtos/category-delete-many.dto";
import { CategoryUpdateManyActiveDto } from "./dtos/category-update-many-active.dto";
import { CategoryListResourceDto } from "./dtos/category-list-response.dto";
import { CategoryCatalogResourceDto } from "./dtos/category-catalog-response.dto";

@ApiTags("Categories")
@ApiExtraModels(ApiResponse, CategoryResponseDto, CategoryCatalogResourceDto)
@Controller("categories")
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
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiQuery({ name: "query", required: false, type: String })
    @Get()
    @UseGuards(SessionGuard)
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
    @Get("list")
    @Serialize(CategoryListResourceDto)
    async list() {
        return createApiOkResponse(await this.categoriesService.getAll());
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
            properties: {
                data: {
                    $ref: getSchemaPath(CategoryDeleteManyDto),
                },
            },
        },
    })
    @ApiBadRequestResponse()
    @Post("delete")
    @Serialize(CategoryResponseDto)
    @UseGuards(SessionGuard)
    @UseGuards(AdminGuard)
    async deleteMany(@Body() dto: CategoryDeleteManyDto) {
        await this.categoriesService.deleteMany(dto.ids);

        return createApiOkMessageResponse("Categories deleted successfully");
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
    @UseGuards(SessionGuard)
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
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: CategoryCreateDto,
    })
    @Post()
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor("icon"))
    async create(
        @UploadedFile() icon: Express.Multer.File,
        @Body() dto: CategoryCreateDto,
    ) {
        return createApiOkSingleResponse(
            await this.categoriesService.create({
                ...dto,
                iconUrl: icon.filename,
            }),
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
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        type: CategoryUpdateDto,
    })
    @Patch(":id")
    @Serialize(CategoryResponseDto)
    @UseInterceptors(FileInterceptor("icon"))
    @UseGuards(AdminGuard)
    async update(
        @Param("id", ParseUUIDPipe) categoryId: string,
        @Body() dto: CategoryUpdateDto,
        @UploadedFile() icon?: Express.Multer.File,
    ) {
        return createApiOkSingleResponse(
            await this.categoriesService.update(categoryId, {
                ...dto,
                ...(icon && { iconUrl: icon.filename }),
            }),
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
    @Patch("actions/toggle-enabled")
    @UseGuards(AdminGuard)
    @Serialize(CategoryResponseDto)
    async toggleEnabled(@Body() dto: CategoryUpdateManyActiveDto) {
        return createApiOkResponse(
            await this.categoriesService.updateMany(dto.ids, {
                isActive: dto.isActive,
            }),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Delete(":id")
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    async delete(@Param("id", ParseUUIDPipe) categoryId: string) {
        await this.categoriesService.delete(categoryId);
        return createApiOkMessageResponse("Category deleted successfully");
    }
}
