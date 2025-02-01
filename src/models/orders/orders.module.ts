import { Module } from "@nestjs/common";
import { OrderItem } from "./entities/order-item.entity";
import { Order } from "./entities/order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersService } from "./orders.service";
import { Product } from "../products/product.entity";
import { OrdersController } from "./orders.controller";
import { OrderHistoryController } from "./order-history.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
    controllers: [OrdersController, OrderHistoryController],
    providers: [OrdersService],
    exports: [OrdersService],
})
export class OrdersModule {}
