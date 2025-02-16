import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterConfigModule } from "@/config/multer/config.module";
import { ConfigModule } from "@nestjs/config";
import { UploadsService } from "./uploads.service";

@Module({
    imports: [ConfigModule, MulterConfigModule],
    controllers: [UploadsController],
    providers: [UploadsService],
    exports: [UploadsService],
})
export class UploadsModule {}
