import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SessionMiddleware } from "./common/middlewares/session.middleware";
import { PostgresDatabaseProviderModule } from "./providers/database/postgres/provider.module";
import { UsersModule } from "./models/users/users.module";
import { SessionsModule } from "./models/sessions/sessions.module";
import { AuthModule } from "./auth/auth.module";
import { SessionConfigModule } from "./config/session/config.module";
import { PostgresDatabaseConfigModule } from "./config/database/postgres/config.module";

@Module({
    imports: [
        // Global
        ConfigModule.forRoot(),

        // Configs
        SessionConfigModule,
        PostgresDatabaseConfigModule,

        // Database
        PostgresDatabaseProviderModule,

        // Modules
        UsersModule,
        SessionsModule,

        // Auth
        AuthModule,
    ],
    controllers: [],
    providers: [SessionMiddleware],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SessionMiddleware).forRoutes("*");
    }
}
