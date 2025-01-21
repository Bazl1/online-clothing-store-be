import {
    BadRequestException,
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
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { AdminGuard } from "@/common/guards/admin.guard";
import { ProductCreateDto } from "./dtos/product-create.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { ProductResponseDto } from "./dtos/product-response.dto";
import { ProductUpdateDto } from "./dtos/product-update.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiConsumes,
    ApiExtraModels,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { Product } from "./product.entity";
import { Category } from "../categories/category.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@ApiTags("Products")
@ApiExtraModels(ApiResponse, ProductResponseDto)
@Controller("products")
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

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
    @ApiConsumes("multipart/form-data")
    @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(FilesInterceptor("images"))
    @Serialize(ProductResponseDto)
    async create(
        @Body() dto: ProductCreateDto,
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: dto.categoryId,
            },
        });

        if (!category) {
            throw new BadRequestException("Category does not exist");
        }

        return createApiOkSingleResponse(
            await this.productsService.create(
                new Product({
                    ...dto,
                    category: category,
                    images: images?.map((image) => image.filename) ?? [],
                }),
            ),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Post("delete")
    @UseGuards(AdminGuard)
    async deleteMany(@Body("ids") ids: string[]) {
        await this.productsService.deleteMany(ids);
        return createApiOkMessageResponse("Products deleted successfully");
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Post("get")
    @UseGuards(AdminGuard)
    async getMany(@Body("ids") ids: string[]) {
        await this.productsService.deleteMany(ids);
        return createApiOkMessageResponse("Products deleted successfully");
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Delete(":id")
    @UseGuards(AdminGuard)
    async delete(@Param("id", ParseUUIDPipe) id: string) {
        await this.productsService.delete(id);
        return createApiOkMessageResponse("Product deleted successfully");
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Patch("actions/toggle-enabled")
    @UseGuards(AdminGuard)
    async activate(
        @Body("ids") ids: string[],
        @Body("isActive") isActive: boolean,
    ) {
        await this.productsService.updateMany(ids, {
            isActive,
        });
        return createApiOkMessageResponse(
            "Products active status changed successfully",
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
    @ApiConsumes("multipart/form-data")
    @Patch(":id")
    @UseGuards(AdminGuard)
    @UseInterceptors(FilesInterceptor("uploadedFiles"))
    @Serialize(ProductResponseDto)
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() dto: ProductUpdateDto,
        @UploadedFiles() uploadedFiles: Express.Multer.File[],
    ) {
        let category: Category | undefined;
        if (dto.categoryId) {
            category = await this.categoryRepository.findOne({
                where: {
                    id: dto.categoryId,
                },
            });

            delete dto.categoryId;
        }

        return createApiOkSingleResponse(
            await this.productsService.updateWithImages(
                id,
                { ...dto, category },
                dto.deletedFiles ?? [],
                uploadedFiles?.map((file) => file.filename) ?? [],
            ),
        );
    }

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
    @Get()
    @Serialize(ProductResponseDto)
    async getAll(
        @Query("search") search: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        const { items, totalItems, totalPages } =
            await this.productsService.getAll(
                search,
                page,
                limit,
                undefined,
                undefined,
                undefined,
            );

        return createApiOkResponse(items, page, totalItems, totalPages);
    }

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
        enum: ["price-asc", "price-desc"],
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
    @Get("catalog")
    @Serialize(ProductResponseDto)
    async getAllFromCatalog(
        @Query("search") search: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("sort") sort: "price-asc" | "price-desc" = "price-asc",
        @Query("maxPrice") maxPrice?: number,
        @Query("minPrice") minPrice?: number,
    ) {
        const { items, totalItems, totalPages } =
            await this.productsService.getAll(
                search,
                page,
                limit,
                maxPrice,
                minPrice,
                sort,
                true,
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
    async getById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productsService.getById(id),
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
    @ApiParam({
        name: "id",
        type: "string",
        format: "uuid",
    })
    @Get("catalog/:id")
    @Serialize(ProductResponseDto)
    async catalogGetById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productsService.getById(id),
        );
    }
}
