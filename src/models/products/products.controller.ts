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
import { ProductsService } from "./products.service";
import { SessionGuard } from "@/common/guards/session.guard";
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
    ApiOkResponse,
    getSchemaPath,
} from "@nestjs/swagger";
import { Product } from "./product.entity";
import { Category } from "../categories/category.entity";

@Controller("products")
@UseGuards(SessionGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

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
        @UploadedFile() images: Express.Multer.File[],
    ) {
        return createApiOkSingleResponse(
            await this.productsService.create(
                new Product({
                    ...dto,
                    category: new Category({
                        id: dto.categoryId,
                    }),
                    images: images.map((image) => image.filename),
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
            isActive: true,
        });
        return createApiOkMessageResponse("Products activated successfully");
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
        @UploadedFile("uploadedFiles") uploadedFiles: Express.Multer.File[],
    ) {
        return createApiOkSingleResponse(
            await this.productsService.updateWithImages(
                id,
                dto,
                dto.deletedFiles,
                uploadedFiles.map((file) => file.filename),
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
    @Get()
    @Serialize(ProductResponseDto)
    async getAll(
        @Query("search") search: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("maxPrice", ParseIntPipe) maxPrice?: number,
        @Query("minPrice", ParseIntPipe) minPrice?: number,
        @Query("sort") sort: "price-asc" | "price-desc" = "price-asc",
    ) {
        const { items, totalItems, totalPages } =
            await this.productsService.getAll(
                search,
                page,
                limit,
                maxPrice,
                minPrice,
                sort,
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
    @Get("catalog")
    @Serialize(ProductResponseDto)
    async getAllFromCatalog(
        @Query("search") search: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("maxPrice", ParseIntPipe) maxPrice?: number,
        @Query("minPrice", ParseIntPipe) minPrice?: number,
        @Query("sort") sort: "price-asc" | "price-desc" = "price-asc",
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
    @Get("catalog/:id")
    @Serialize(ProductResponseDto)
    async getById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productsService.getById(id),
        );
    }
}
