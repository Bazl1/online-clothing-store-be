import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "./entities/order-status";
import { OrderCreateDto } from "./dtos/order-create.dto";
import { User } from "../users/entities/user.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "../products/product.entity";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async get(page: number, limit: number) {
        const totalItems = await this.orderRepository.count();

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.orderRepository.find({
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: ["user", "items"],
        });

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async history(page: number, limit: number) {
        const totalItems = await this.orderRepository.count({
            where: {
                status: OrderStatus.Pending,
            },
        });

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.orderRepository.find({
            where: {
                status: OrderStatus.Pending,
            },
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: ["user", "items"],
        });

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async getById(id: string) {
        return this.orderRepository.findOne({
            where: {
                id,
            },
            relations: ["user", "items"],
        });
    }

    async create(user: User, dto: OrderCreateDto) {
        const items = await Promise.all(
            dto.items.map(async (item) => {
                const product = await this.productRepository.findOne({
                    where: {
                        id: item.productId,
                    },
                });

                const orderItem = new OrderItem({
                    product: product,
                    price: product.price,
                    quantity: item.quantity,
                });

                return this.orderItemRepository.save(orderItem);
            }),
        );

        const order = new Order({
            ...dto,
            user,
            items,
            status: OrderStatus.Pending,
            totalPrice: items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            ),
        });

        return this.orderRepository.save(order);
    }

    async update() {}

    async delete(id: string) {
        await this.orderRepository.delete(id);
    }
}
