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
import { UsersService } from "./users.service";
import { UserResponseDto } from "./dtos/user-response.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { AdminGuard } from "@/common/guards/admin.guard";
import { createApiOkResponse } from "@/common/interfaces/responses/api-response";
import { UpdateUserWithAddressDto } from "./dtos/update-user-with-address.dto";
import { CreateUserAddressAdminDto } from "./dtos/create-user.admin-dto";
import { User } from "./entities/user.entity";
import { Address } from "./entities/address.entity";
import data from "@/database/seeders/users/data";
import { DeleteManyUserAdminDto } from "./dtos/delete-many-user.admin-dto";

@ApiTags("Users")
@ApiExtraModels(ApiResponse, UserResponseDto)
@Controller("users")
@UseGuards(AdminGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(ApiResponse) },
                {
                    properties: {
                        data: {
                            $ref: getSchemaPath(UserResponseDto),
                        },
                    },
                },
            ],
        },
    })
    @Serialize(UserResponseDto)
    async create(@Body() dto: CreateUserAddressAdminDto) {
        const user = await this.usersService.createUserWithAddress(
            new User({
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: dto.password,
                phoneNumber: dto.phoneNumber,
            }),
            new Address({
                country: dto.country,
                state: dto.state,
                city: dto.city,
                street: dto.street,
                house: dto.house,
                flat: dto.flat,
                floor: dto.floor,
                zip: dto.zip,
            }),
        );

        return createApiOkSingleResponse(user, "User created successfully");
    }

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
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Page number",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        description: "Items per page",
    })
    @ApiQuery({
        name: "query",
        required: false,
        type: String,
        description: "Search query",
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
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
            properties: {
                data: {
                    $ref: getSchemaPath(DeleteManyUserAdminDto),
                },
            },
        },
    })
    @Post("delete")
    async deleteMany(@Body() dto: DeleteManyUserAdminDto) {
        await this.usersService.deleteMany(dto.ids);
        return createApiOkMessageResponse("Users deleted successfully");
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
        return createApiOkSingleResponse(
            await this.usersService.updateUserWithAddress(userId, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @Delete(":id")
    @Serialize(UserResponseDto)
    async delete(@Param("id", ParseUUIDPipe) userId: string) {
        await this.usersService.delete(userId);
        return createApiOkMessageResponse("User deleted");
    }
}
