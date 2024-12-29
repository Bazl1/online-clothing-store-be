import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dtos/register.dto";
import { AuthCookieHelper } from "@/common/helpers/auth-cookie.helper";
import { LoginDto } from "./dtos/login.dto";
import { SessionGuard } from "@/common/guards/session.guard";
import { Request } from "@/common/types/request";
import { Session } from "@/common/decorators/request/session.decorator";
import { Session as SessionEntity } from "@/models/sessions/session.entity";
import { Response } from "@/common/types/response";
import { Serialize } from "@/common/decorators/response/serialize.decorator";
import { UserResponseDto } from "@/models/users/dtos/user-response.dto";
import {
    ApiResponse,
    createApiOkMessageResponse,
    createApiOkSingleResponse,
} from "@/common/interfaces/responses/api-response";
import {
    ApiBadRequestResponse,
    ApiExtraModels,
    ApiOkResponse,
    ApiTags,
    getSchemaPath,
} from "@nestjs/swagger";
import { UsersService } from "@/models/users/users.service";

@ApiTags("Auth")
@ApiExtraModels(ApiResponse, UserResponseDto)
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

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
    @Post("register")
    @HttpCode(HttpStatus.OK)
    @Serialize(UserResponseDto)
    async register(
        @Res({ passthrough: true }) res: Request,
        @Body() data: RegisterDto,
    ) {
        const session = await this.authService.register(data);
        AuthCookieHelper.setAuthCookie(res, session.id, session.expiresAt);

        return createApiOkSingleResponse(session.user);
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
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) res: Request,
        @Body() data: LoginDto,
    ) {
        const session = await this.authService.login(data);
        AuthCookieHelper.setAuthCookie(res, session.id, session.expiresAt);

        return createApiOkSingleResponse(session.user);
    }

    @ApiOkResponse()
    @ApiBadRequestResponse()
    @Post("logout")
    @UseGuards(SessionGuard)
    @HttpCode(HttpStatus.OK)
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Session() session: SessionEntity,
    ) {
        await this.authService.logout(session.id);
        AuthCookieHelper.clearAuthCookie(res);

        return createApiOkMessageResponse(
            "User has been successfully logged out",
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
    @Get("me")
    @UseGuards(SessionGuard)
    @HttpCode(HttpStatus.OK)
    @Serialize(UserResponseDto)
    async me(@Session() session: SessionEntity) {
        return createApiOkSingleResponse(
            await this.usersService.getById(session.user.id),
        );
    }
}
