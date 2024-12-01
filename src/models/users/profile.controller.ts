import { Body, Controller, Put, Session, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session as SessionEntity } from "../sessions/entities/session.entity";
import { UserUpdateDto } from "./dtos/user-update.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { ApiResponse } from "@/common/interfaces/responses/api-response";
import { UserResetPasswordDto } from "./dtos/user-reset-password.dto";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { AddressCreateOrUpdateDto } from "./dtos/address-create.dto";

@ApiTags("Profile")
@ApiExtraModels(ApiResponse, UserResponseDto)
@Controller("profile")
@UseGuards(SessionGuard)
export class ProfileController {
    constructor(private readonly usersService: UsersService) {}

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
    @Put()
    @Serialize(UserResponseDto)
    async update(
        @Session() session: SessionEntity,
        @Body() dto: UserUpdateDto,
    ) {
        const user = await this.usersService.update(session.user.id, dto);

        return {
            data: user,
            success: true,
        } as ApiResponse<UserResponseDto>;
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Put("password")
    @Serialize(UserResponseDto)
    async updatePassword(
        @Session() session: SessionEntity,
        @Body() dto: UserResetPasswordDto,
    ) {
        const user = await this.usersService.updatePassword(
            session.user.id,
            dto,
        );

        return {
            success: true,
        } as ApiResponse<null>;
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
    @Put("address")
    @Serialize(UserResponseDto)
    async updateAddress(
        @Session() session: SessionEntity,
        @Body() dto: AddressCreateOrUpdateDto,
    ) {
        const user = await this.usersService.createAddressOrUpdateAddress(
            session.user,
            dto,
        );

        return {
            data: user,
            success: true,
        } as ApiResponse<UserResponseDto>;
    }
}
