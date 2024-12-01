import { Module } from "@nestjs/common";
import { PostgresDatabaseConfig } from "./config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [PostgresDatabaseConfig],
    exports: [PostgresDatabaseConfig],
})
export class PostgresDatabaseConfigModule {}
