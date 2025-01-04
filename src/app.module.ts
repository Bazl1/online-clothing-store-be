import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SessionMiddleware } from "./common/middlewares/session.middleware";
import { PostgresDatabaseProviderModule } from "./providers/database/postgres/provider.module";
import { UsersModule } from "./models/users/users.module";
import { SessionsModule } from "./models/sessions/sessions.module";
import { AuthModule } from "./auth/auth.module";
import { SessionConfigModule } from "./config/session/config.module";
import { PostgresDatabaseConfigModule } from "./config/database/postgres/config.module";
import { SeederModule } from "./database/seeders/seeder.module";
import { UsersSeederModule } from "./database/seeders/users/users.module";
import { CategoriesModule } from "./models/categories/categories.module";
import { MulterConfigModule } from "./config/multer/config.module";
import { ProductsModule } from "./models/products/products.module";
import { UploadsModule } from "./uploads/uploads.module";
import { CommentsModule } from "./models/comments/comments.module";
import { OrdersModule } from "./models/orders/orders.module";

@Module({
    imports: [
        // Global
        ConfigModule.forRoot(),

        // Configs
        SessionConfigModule,
        PostgresDatabaseConfigModule,
        MulterConfigModule,

        // Database
        PostgresDatabaseProviderModule,

        // Files
        UploadsModule,

        // Modules
        UsersModule,
        SessionsModule,
        CategoriesModule,
        ProductsModule,
        CommentsModule,
        OrdersModule,

        // Auth
        AuthModule,

        // Seeders
        UsersSeederModule,
        SeederModule,
    ],
    controllers: [],
    providers: [SessionMiddleware],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SessionMiddleware).forRoutes("*");
    }
}
