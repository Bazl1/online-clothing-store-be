import { Module } from "@nestjs/common";
import { Product } from "./entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "@/config/multer/config.service";
import { MulterConfigModule } from "@/config/multer/config.module";
import { ConfigModule } from "@nestjs/config";
import { ProductsService } from "./products.service";
import { ProductComment } from "./entities/product-comment.entity";

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfigService,
            inject: [MulterConfigModule],
            imports: [ConfigModule],
        }),
        TypeOrmModule.forFeature([Product, ProductComment]),
    ],
    controllers: [],
    providers: [ProductsService],
    exports: [ProductsService],
})
export class ProductsModule {}
