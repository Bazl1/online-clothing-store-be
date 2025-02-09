import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { In, Repository } from "typeorm";
import { OrderStatus } from "./entities/order-status";
import { OrderCreateDto } from "./dtos/order-create.dto";
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
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async get(page: number, limit: number, orderIds?: string[]) {
        const totalItems = await this.orderRepository.count();

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.orderRepository.find({
            ...(orderIds && {
                where: {
                    id: In(orderIds),
                },
            }),
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: ["items", "items.product", "items.product.category"],
        });

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async historyGetAll(email: string, page: number, limit: number) {
        const totalItems = await this.orderRepository.count({
            where: {
                status: OrderStatus.Completed || OrderStatus.Cancelled,
                email,
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
            relations: ["items", "items.product", "items.product.category"],
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
            relations: ["items", "items.product", "items.product.category"],
        });
    }

    async getById(id: string) {
        return this.orderRepository.findOne({
            where: {
                id,
            },
            relations: ["items", "items.product", "items.product.category"],
        });
    }

    async create(dto: OrderCreateDto) {
        const items = await Promise.all(
            dto.items.map(async (item) => {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(
                        `Product with ID ${item.productId} not found`,
                    );
                }

                return this.orderItemRepository.save(
                    this.orderItemRepository.create({
                        product,
                        quantity: item.quantity ?? 1,
                        price: product.price,
                    }),
                );
            }),
        );

        const order = this.orderRepository.create({
            ...dto,
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
