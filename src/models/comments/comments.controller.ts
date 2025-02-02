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
    UseGuards,
} from "@nestjs/common";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session as SessionType } from "../sessions/session.entity";
import { Session } from "@/common/decorators/request/session.decorator";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CommentResponseDto } from "./dtos/comment-response.dto";
import { CommentCreateDto } from "./dtos/comment-create.dto";
import { Comment } from "./comment.entity";
import { Product } from "../products/product.entity";

@ApiTags("Product Comments")
@ApiExtraModels(CommentResponseDto, ApiResponse)
@Controller("comments")
@UseGuards(SessionGuard)
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CommentResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Post()
    @Serialize(CommentResponseDto)
    async create(
        @Body() dto: CommentCreateDto,
        @Session() session: SessionType,
    ) {
        return createApiOkSingleResponse(
            await this.commentsService.create(
                new Comment({
                    ...dto,
                    user: session.user,
                    product: new Product({ id: dto.productId }),
                }),
            ),
            "Product comment created successfully",
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Post("delete")
    async deleteMany(@Body("ids") ids: number[]) {
        await this.commentsService.deleteMany(ids);
        return createApiOkMessageResponse(
            "Product comments deleted successfully",
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Delete(":id")
    async delete(@Param("id") id: number) {
        await this.commentsService.delete(id);
        return createApiOkMessageResponse(
            "Product comment deleted successfully",
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CommentResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Patch(":id")
    @Serialize(CommentResponseDto)
    async update(@Param("id") id: number, @Body() dto: CommentCreateDto) {
        return createApiOkSingleResponse(
            await this.commentsService.update(id, dto),
            "Product comment updated successfully",
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CommentResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiQuery({ name: "productId", required: true })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @Get()
    @Serialize(CommentResponseDto)
    async findAll(
        @Query("productId", ParseUUIDPipe) productId: number,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        const { items, totalItems, totalPages } =
            await this.commentsService.getAll(productId, page, limit);

        return createApiOkResponse(
            items,
            page,
            totalPages,
            totalItems,
            "Product comments retrieved successfully",
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(CommentResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get(":id")
    @Serialize(CommentResponseDto)
    async findOne(@Param("id") id: number) {
        return createApiOkSingleResponse(
            await this.commentsService.getById(id),
            "Product comment retrieved successfully",
        );
    }
}
