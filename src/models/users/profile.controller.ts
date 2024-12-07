import {
    Body,
    Controller,
    Patch,
    Put,
    Session,
    UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SessionGuard } from "@/common/guards/session.guard";
import { Session as SessionEntity } from "../sessions/entities/session.entity";
import { UserUpdateDto } from "./dtos/user-update.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import {
    ApiResponse,
    createApiOkResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
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
    @Patch()
    @Serialize(UserResponseDto)
    async update(
        @Session() session: SessionEntity,
        @Body() dto: UserUpdateDto,
    ) {
        return createApiOkSingleResponse(
            await this.usersService.update(session.user.id, dto),
        );
    }

    @ApiOkResponse({
        schema: {
            allOf: [{ $ref: getSchemaPath(ApiResponse) }],
        },
    })
    @ApiBadRequestResponse()
    @Patch("password")
    @Serialize(UserResponseDto)
    async updatePassword(
        @Session() session: SessionEntity,
        @Body() dto: UserResetPasswordDto,
    ) {
        return createApiOkSingleResponse(
            await this.usersService.updatePassword(session.user.id, dto),
            "Password updated successfully",
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
    @ApiBadRequestResponse()
    @Patch("address")
    @Serialize(UserResponseDto)
    async updateAddress(
        @Session() session: SessionEntity,
        @Body() dto: AddressCreateOrUpdateDto,
    ) {
        return createApiOkResponse(
            await this.usersService.createAddressOrUpdateAddress(
                session.user,
                dto,
            ),
        );
    }
}
