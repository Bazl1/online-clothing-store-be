import { Module } from "@nestjs/common";
import { SessionConfig } from "./config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    controllers: [],
    providers: [SessionConfig],
    exports: [SessionConfig],
})
export class SessionConfigModule {}
