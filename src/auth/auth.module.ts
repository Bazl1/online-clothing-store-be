import { SessionsModule } from "@/models/sessions/sessions.module";
import { UsersModule } from "@/models/users/users.module";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionConfigModule } from "@/config/session/config.module";
import { PasswordService } from "./password.service";

@Module({
    imports: [SessionConfigModule, UsersModule, SessionsModule],
    controllers: [AuthController],
    providers: [AuthService, PasswordService],
    exports: [],
})
export class AuthModule {}
