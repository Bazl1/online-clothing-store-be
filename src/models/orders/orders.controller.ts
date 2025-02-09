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
    ApiExtraModels,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { OrderResponseDto } from "./dtos/order-response.dto";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { OrderUpdateDto } from "./dtos/order-update.dto";
import { OrderCreateDto } from "./dtos/order-create.dto";
import { OrdersService } from "./orders.service";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session } from "@/common/decorators/request/session.decorator";
import { Session as SessionEntity } from "@/models/sessions/session.entity";
import { User } from "../users/entities/user.entity";

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
    @Get()
    @Serialize(OrderResponseDto)
    async get(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("orderId") orderId?: string,
    ) {
        const { totalItems, totalPages, items } = await this.ordersService.get(
            page,
            limit,
            orderId,
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
