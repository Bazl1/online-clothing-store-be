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
import { CategoryCreateDto } from "./dto/category-create.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
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
import { FileInterceptor } from "@nestjs/platform-express";

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
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Delete()
    @Serialize(CategoryResponseDto)
    @UseGuards(AdminGuard)
    async deleteMany(@Body("ids", ParseUUIDPipe) ids: string[]) {
        await this.categoriesService.deleteMany(ids);

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
    @UseInterceptors(FileInterceptor("icon"))
    async craete(
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
