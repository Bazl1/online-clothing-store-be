import {
    ApiResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Query,
    UseGuards,
} from "@nestjs/common";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { OrderResponseDto } from "./dtos/order-response.dto";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session } from "@/common/decorators/request/session.decorator";
import { Session as SessionEntity } from "@/models/sessions/session.entity";

@ApiTags("Order history")
@ApiExtraModels(OrderResponseDto, ApiResponse)
@Controller("order-history")
export class OrderHistoryController {
    constructor(private readonly ordersService: OrdersService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(OrderResponseDto),
                            type: "array",
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get()
    @UseGuards(SessionGuard)
    @Serialize(OrderResponseDto)
    async get(
        @Session() session: SessionEntity,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    ) {
        const { totalItems, totalPages, items } =
            await this.ordersService.historyGetAll(
                session.user.email,
                page,
                limit,
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
    @Get(":id")
    @Serialize(OrderResponseDto)
    async getById(@Param("id") id: string) {
        return createApiOkSingleResponse(
            await this.ordersService.historyGetById(id),
        );
    }
}
