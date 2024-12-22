import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { MulterConfigModule } from "@/config/multer/config.module";

@Module({
    imports: [MulterConfigModule],
    controllers: [FilesController],
    providers: [],
})
export class FilesModule {}
