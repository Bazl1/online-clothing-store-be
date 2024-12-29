import { Module } from "@nestjs/common";
import { Product } from "./product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "@/config/multer/config.service";
import { MulterConfigModule } from "@/config/multer/config.module";
import { ConfigModule } from "@nestjs/config";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
            inject: [MulterConfigModule],
            imports: [ConfigModule],
        }),
        TypeOrmModule.forFeature([Product]),
    ],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
