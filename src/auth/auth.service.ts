import { SessionsService } from "@/models/sessions/sessions.service";
import { UsersService } from "@/models/users/users.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { User } from "@/models/users/entities/user.entity";
import { Session } from "@/models/sessions/session.entity";
import { SessionConfig } from "@/config/session/config.service";
import { LoginDto } from "./dtos/login.dto";
import { PasswordService } from "./password.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly sessionConfig: SessionConfig,
        private readonly passwordService: PasswordService,
        private readonly sessionsService: SessionsService,
        private readonly usersService: UsersService,
    ) {}

    async register(data: RegisterDto) {
        if (await this.usersService.getByEmail(data.email)) {
            throw new BadRequestException(
                "User with this email already exists",
            );
        }

        data.password = await this.passwordService.hashPassword(data.password);

        const user = await this.usersService.create(new User(data));

        const session = await this.sessionsService.create(
            new Session({
                user,
                expiresAt: new Date(
                    Date.now() + this.sessionConfig.availableSessionTime,
                ),
            }),
        );

        return this.sessionsService.getById(session.id);
    }

    async login(data: LoginDto) {
        const user = await this.usersService.getByEmail(data.email);

        if (!user) {
            throw new BadRequestException("User not found");
        }

        if (
            !this.passwordService.comparePasswords(data.password, user.password)
        ) {
            throw new BadRequestException("Invalid password");
        }

        const session = await this.sessionsService.create(
            new Session({
                user,
                expiresAt: new Date(
                    Date.now() + this.sessionConfig.availableSessionTime,
                ),
            }),
        );

        return this.sessionsService.getById(session.id);
    }

    async logout(sessionId: string) {
        return this.sessionsService.delete(sessionId);
    }
}
