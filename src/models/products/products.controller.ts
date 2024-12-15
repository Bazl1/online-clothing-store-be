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
import { ProductCreateDto } from "./dto/product-create.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ProductUpdateDto } from "./dto/product-update.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    getSchemaPath,
} from "@nestjs/swagger";
import { Product } from "./entities/product.entity";

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
    @Delete()
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
    @Patch("id")
    @UseGuards(AdminGuard)
    @UseInterceptors(FilesInterceptor("images"))
    @Serialize(ProductResponseDto)
    async update(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() dto: ProductUpdateDto,
        @UploadedFile() images: Express.Multer.File[],
    ) {
        return createApiOkSingleResponse(
            await this.productsService.update(id, {
                ...dto,
                images: images.map((image) => image.filename),
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
                        data: { $ref: getSchemaPath(ProductResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get(":id")
    @Serialize(ProductResponseDto)
    async getById(@Param("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productsService.getById(id),
        );
    }
}
