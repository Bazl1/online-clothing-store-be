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
    Query,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dtos/user-response.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { AdminGuard } from "@/common/guards/admin.guard";
import { createApiOkResponse } from "@/common/interfaces/responses/api-response";
import { UserUpdateDto } from "./dtos/user-update.dto";
import { AddressCreateOrUpdateDto } from "./dtos/address-create-or-update.dto";
import { UpdateUserWithAddressDto } from "./dtos/update-user-with-address.dto";

@ApiTags("Users")
@ApiExtraModels(ApiResponse, UserResponseDto)
@Controller("users")
@UseGuards(AdminGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            type: "array",
                            items: {
                                $ref: getSchemaPath(UserResponseDto),
                            },
                        },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get()
    @Serialize(UserResponseDto)
    async search(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("query") query?: string,
    ) {
        const { users, totalPages, totalItems } =
            await this.usersService.search(query, page, limit);

        return createApiOkResponse(users, page, totalPages, totalItems);
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(UserResponseDto) },
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse()
    @Get(":id")
    @Serialize(UserResponseDto)
    async getById(@Param("id", ParseUUIDPipe) userId: string) {
        return createApiOkResponse(await this.usersService.getById(userId));
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(UserResponseDto) },
                    },
                },
            ],
        },
    })
    @Patch(":id")
    @Serialize(UserResponseDto)
    async update(
        @Param("id", ParseUUIDPipe) userId: string,
        @Body() dto: UpdateUserWithAddressDto,
    ) {
        return createApiOkResponse(
            await this.usersService.updateUserWithAddress(userId, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(UserResponseDto) },
                    },
                },
            ],
        },
    })
    @Patch(":id/address")
    @Serialize(UserResponseDto)
    async updateAddress(
        @Param("id", ParseUUIDPipe) userId: string,
        @Body() dto: AddressCreateOrUpdateDto,
    ) {
        const user = await this.usersService.getById(userId);
        return createApiOkResponse(
            await this.usersService.createAddressOrUpdateAddress(user, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: { $ref: getSchemaPath(UserResponseDto) },
                    },
                },
            ],
        },
    })
    @Delete(":id")
    @Serialize(UserResponseDto)
    async delete(@Param("id", ParseUUIDPipe) userId: string) {
        await this.usersService.delete(userId);
        return createApiOkMessageResponse("User deleted");
    }
}
