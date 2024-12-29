import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "@/config/multer/config.service";
import { MulterConfigModule } from "@/config/multer/config.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
            inject: [MulterConfigModule],
            imports: [ConfigModule],
        }),
        TypeOrmModule.forFeature([Category]),
    ],
    controllers: [CategoriesController],
    providers: [CategoriesService],
    exports: [CategoriesService],
})
export class CategoriesModule {}
