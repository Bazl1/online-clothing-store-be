import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";
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
import { OrderResponseDto } from "./dtos/order-response.dto";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { OrderUpdateDto } from "./dtos/order-update.dto";
import { OrderCreateDto } from "./dtos/order-create.dto";
import { OrdersService } from "./orders.service";

@ApiTags("Orders")
@ApiExtraModels(OrderResponseDto, ApiResponse)
@Controller("orders")
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(OrderResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiQuery({
        name: "page",
        type: "number",
        required: false,
    })
    @ApiQuery({
        name: "limit",
        type: "number",
        required: false,
    })
    @ApiQuery({
        name: "search",
        type: "string",
        required: false,
    })
    @ApiQuery({
        name: "orderIds",
        type: "array",
        required: false,
    })
    @Get()
    @Serialize(OrderResponseDto)
    async get(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("search") search?: string,
        @Body("orderIds") orderIds?: string[],
    ) {
        const { totalItems, totalPages, items } = await this.ordersService.get(
            page,
            limit,
            search,
            orderIds,
        );

        return createApiOkResponse(items, page, totalPages, totalItems);
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(OrderResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @ApiParam({
        name: "id",
        type: "string",
        required: true,
        description: "Order ID",
    })
    @Get(":id")
    @Serialize(OrderResponseDto)
    async getById(@Param("id") id: string) {
        return createApiOkSingleResponse(await this.ordersService.getById(id));
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(OrderResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Post()
    @Serialize(OrderResponseDto)
    async create(@Body() dto: OrderCreateDto) {
        return createApiOkSingleResponse(await this.ordersService.create(dto));
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(OrderResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Post("client")
    @Serialize(OrderResponseDto)
    async createCreate(@Body() dto: OrderCreateDto) {
        return createApiOkSingleResponse(await this.ordersService.create(dto));
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @ApiParam({
        name: "id",
        type: "string",
        required: true,
        description: "Order ID",
    })
    @Patch(":id")
    @Serialize(OrderResponseDto)
    async update(@Param("id") id: string, @Body() dto: OrderUpdateDto) {
        return createApiOkSingleResponse(
            await this.ordersService.update(id, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @ApiParam({
        name: "id",
        type: "string",
        required: true,
        description: "Order ID",
    })
    @Delete(":id")
    @Serialize(OrderResponseDto)
    async delete(@Param("id") id: string) {
        await this.ordersService.delete(id);
        return createApiOkMessageResponse("Order deleted");
    }
}
