import { Module } from "@nestjs/common";
import { MulterConfigService } from "./config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [MulterConfigService],
    exports: [MulterConfigService],
})
export class MulterConfigModule {}
