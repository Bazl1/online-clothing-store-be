import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "./entities/order-status";
import { OrderCreateDto } from "./dtos/order-create.dto";
import { User } from "../users/entities/user.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "../products/product.entity";
import { OrderUpdateDto } from "./dtos/order-update.dto";

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    async get(page: number, limit: number, orderId?: string) {
        const totalItems = await this.orderRepository.count();

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.orderRepository.find({
            ...(orderId && {
                where: {
                    id: orderId,
                },
            }),
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: [
                "user",
                "items",
                "items.product",
                "items.product.category",
            ],
        });

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async historyGetAll(page: number, limit: number) {
        const totalItems = await this.orderRepository.count({
            where: {
                status: OrderStatus.Completed || OrderStatus.Cancelled,
            },
        });

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.orderRepository.find({
            where: {
                status: OrderStatus.Completed || OrderStatus.Cancelled,
            },
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: [
                "user",
                "items",
                "items.product",
                "items.product.category",
            ],
        });

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async historyGetById(id: string) {
        return this.orderRepository.findOne({
            where: {
                status: OrderStatus.Completed || OrderStatus.Cancelled,
                id,
            },
            relations: [
                "user",
                "items",
                "items.product",
                "items.product.category",
            ],
        });
    }

    async getById(id: string) {
        return this.orderRepository.findOne({
            where: {
                id,
            },
            relations: [
                "user",
                "items",
                "items.product",
                "items.product.category",
            ],
        });
    }

    async create(user: User | undefined, dto: OrderCreateDto) {
        const items = await Promise.all(
            dto.items.map(
                async (item) =>
                    new OrderItem({
                        product: new Product({
                            id: item.productId,
                        }),
                        quantity: item.quantity,
                    }),
            ),
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

    async update(id: string, dto: OrderUpdateDto) {
        const order = await this.orderRepository.findOne({
            where: {
                id,
            },
            relations: ["items"],
        });

        if (!order) {
            throw new Error("Order not found");
        }

        for (const orderItem of order.items) {
            if (
                dto.items.every((item) => item.id && item.id !== orderItem.id)
            ) {
                await this.orderItemRepository.delete(orderItem.product.id);
            }
        }

        const items = await Promise.all(
            dto.items.map(
                async (item) =>
                    new OrderItem({
                        product: new Product({
                            id: item.productId,
                        }),
                        quantity: item.quantity,
                    }),
            ),
        );

        order.items = items;

        return this.orderRepository.save(order);
    }

    async delete(id: string) {
        await this.orderRepository.delete(id);
    }
}
