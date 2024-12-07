import { Module } from "@nestjs/common";
import { SessionConfig } from "./config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [SessionConfig],
    exports: [SessionConfig],
})
export class SessionConfigModule {}
