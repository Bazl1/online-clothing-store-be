import { Product } from "@/models/products/product.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Order } from "./order.entity";

@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: "productId" })
    product: Product;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "decimal" })
    price: number;

    @ManyToOne(() => Order, (order) => order.items, { nullable: false })
    order: Order;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
    })
    updatedAt: Date;

    constructor(dto: Partial<OrderItem>) {
        Object.assign(this, dto);
    }
}
