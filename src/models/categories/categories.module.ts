import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "@/config/upload/multer/config.service";
import { MulterConfigModule } from "@/config/upload/multer/config.module";

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
            inject: [MulterConfigModule],
        }),
        TypeOrmModule.forFeature([Category]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
