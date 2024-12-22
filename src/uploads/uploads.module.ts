import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { MulterConfigModule } from "@/config/multer/config.module";

@Module({
    imports: [MulterConfigModule],
    controllers: [UploadsController],
    providers: [],
})
export class UploadsModule {}
