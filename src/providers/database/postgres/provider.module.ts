import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostgresDatabaseConfigModule } from "@/config/database/postgres/config.module";
import { PostgresDatabaseConfig } from "@/config/database/postgres/config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (postgresDatabaseConfig: PostgresDatabaseConfig) => ({
                type: "postgres",
                host: postgresDatabaseConfig.host,
                port: postgresDatabaseConfig.port,
                username: postgresDatabaseConfig.username,
                password: postgresDatabaseConfig.password,
                database: postgresDatabaseConfig.database,
                autoLoadEntities: postgresDatabaseConfig.autoLoadEntities,
                synchronize: postgresDatabaseConfig.synchronize,
                entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
            }),
            inject: [PostgresDatabaseConfig],
            imports: [PostgresDatabaseConfigModule],
        }),
    ],
    controllers: [],
    providers: [],
})
export class PostgresDatabaseProviderModule {}
