import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { In, Like, Repository } from "typeorm";
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

    async get(
        page: number,
        limit: number,
        email?: string,
        phoneNumber?: string,
        firstName?: string,
        lastName?: string,
        orderIds?: string[],
    ) {
        const where = {};

        if (email) {
            where["email"] = Like(`${email}%`);
        }

        if (phoneNumber) {
            where["phoneNumber"] = Like(`${phoneNumber}%`);
        }

        if (firstName) {
            where["firstName"] = Like(`${firstName}%`);
        }

        if (lastName) {
            where["lastName"] = Like(`${lastName}%`);
        }

        if (orderIds) {
            where["id"] = In(orderIds);
        }

        const [items, totalItems] = await this.orderRepository.findAndCount({
            where,
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                items: true,
            },
        });

        const totalPages = Math.ceil(totalItems / limit);

        return {
            totalItems,
            totalPages,
            items,
        };
    }

    async historyGetAll(email: string, page: number, limit: number) {
        const [items, totalItems] = await this.orderRepository.findAndCount({
            where: {
                email,
            },
            order: {
                createdAt: "ASC",
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: {
                items: true,
            },
        });

        const totalPages = Math.ceil(totalItems / limit);

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
            relations: {
                items: true,
            },
        });
    }

    async getById(id: string) {
        return this.orderRepository.findOne({
            where: {
                id,
            },
            relations: {
                items: true,
            },
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
                        title: product.title,
                        quantity: item.quantity ?? 1,
                        price: product.discountPrice || product.price,
                    }),
                );
            }),
        );

        const order = this.orderRepository.create({
            ...dto,
            totalPrice: items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0,
            ),
            status: OrderStatus.Pending,
            items,
        });

        return this.orderRepository.save(order);
    }

    async update(id: string, dto: OrderUpdateDto) {
        const order = await this.orderRepository.findOne({
            where: {
                id,
            },
            relations: {
                items: true,
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        for (const orderItem of order.items) {
            if (
                dto.items.every((item) => item.id && item.id !== orderItem.id)
            ) {
                await this.orderItemRepository.delete(orderItem.id);
            }
        }

        order.items = await Promise.all(
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
                        title: product.title,
                        quantity: item.quantity ?? 1,
                        price: product.discountPrice || product.price,
                    }),
                );
            }),
        );

        return this.orderRepository.save(order);
    }

    async delete(id: string) {
        await this.orderRepository.delete(id);
    }
}
