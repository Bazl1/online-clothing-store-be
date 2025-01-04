import { Product } from "@/models/products/product.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
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

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    @OneToMany(() => Order, (order) => order.items)
    @JoinColumn()
    order: Order;

    @Column()
    price: number;

    @Column()
    quantity: number;

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
