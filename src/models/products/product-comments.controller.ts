import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    ParseIntPipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
import { ProductCommentsService } from "./product-comments.service";
import { ProductCommentCreateDto } from "./dto/product-comment-create.dto";
import { ProductComment } from "./entities/product-comment.entity";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { ProductCommentResponseDto } from "./dto/product-comment-response.dto";
import {
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import { Product } from "./entities/product.entity";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session as SessionType } from "../sessions/entities/session.entity";
import { Session } from "@/common/decorators/request/session.decorator";

@Controller("product-comments")
@UseGuards(SessionGuard)
export class ProductCommentsController {
    constructor(
        private readonly productCommentsService: ProductCommentsService,
    ) {}

    @Post()
    @Serialize(ProductCommentResponseDto)
    async create(
        @Body() dto: ProductCommentCreateDto,
        @Session() session: SessionType,
    ) {
        return createApiOkSingleResponse(
            await this.productCommentsService.create(
                new ProductComment({
                    ...dto,
                    user: session.user,
                    product: new Product({ id: dto.productId }),
                }),
            ),
            "Product comment created successfully",
        );
    }

    @Post("delete")
    async deleteMany(@Body("ids") ids: string[]) {
        await this.productCommentsService.deleteMany(ids);
        return createApiOkMessageResponse(
            "Product comments deleted successfully",
        );
    }

    @Delete(":id")
    async delete(id: string) {
        await this.productCommentsService.delete(id);
        return createApiOkMessageResponse(
            "Product comment deleted successfully",
        );
    }

    @Patch(":id")
    @Serialize(ProductCommentResponseDto)
    async update(id: string, @Body() dto: ProductCommentCreateDto) {
        return createApiOkSingleResponse(
            await this.productCommentsService.update(id, dto),
            "Product comment updated successfully",
        );
    }

    @Get()
    @Serialize(ProductCommentResponseDto)
    async findAll(
        @Query("productId", ParseUUIDPipe) productId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        const { items, totalItems, totalPages } =
            await this.productCommentsService.getAll(productId, page, limit);

        return createApiOkResponse(
            items,
            page,
            totalPages,
            totalItems,
            "Product comments retrieved successfully",
        );
    }

    @Get(":id")
    @Serialize(ProductCommentResponseDto)
    async findOne(@Query("id", ParseUUIDPipe) id: string) {
        return createApiOkSingleResponse(
            await this.productCommentsService.getById(id),
            "Product comment retrieved successfully",
        );
    }
}
