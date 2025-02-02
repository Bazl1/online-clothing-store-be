import { User } from "@/models/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderStatus } from "./order-status";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => OrderItem, (item) => item.order)
    @JoinColumn()
    items: OrderItem[];

    @OneToMany(() => User, (user) => user.orders)
    @JoinColumn()
    user: User;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.Pending,
    })
    status: OrderStatus;

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

    @Column()
    house: string;

    @Column()
    flat: string;

    @Column()
    floor: string;

    @Column()
    zip: string;

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
