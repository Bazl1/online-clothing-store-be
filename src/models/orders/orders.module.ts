import { Module } from "@nestjs/common";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { Product } from "../products/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
