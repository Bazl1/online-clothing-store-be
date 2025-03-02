import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "./order-status";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.Pending,
    })
    status: OrderStatus;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    totalPrice: number;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column()
    street: string;

    @Column({ nullable: true })
    house?: string;

    @Column({ nullable: true })
    flat?: string;

    @Column({ nullable: true })
    floor?: string;

    @Column({ nullable: true })
    zip?: string;

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

    constructor(dto: Partial<Order>) {
        Object.assign(this, dto);
    }
}
