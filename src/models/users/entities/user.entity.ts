import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinTable,
    ManyToOne,
} from "typeorm";
import { Address } from "./address.entity";
import { Product } from "@/models/products/product.entity";
import { Order } from "@/models/orders/entities/order.entity";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({
        name: "first_name",
    })
    firstName: string;

    @Column({
        name: "last_name",
    })
    lastName: string;

    @Column({
        name: "phone_number",
        nullable: true,
    })
    phoneNumber?: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Address, (address) => address.user)
    @JoinTable()
    address?: Address;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

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

    @ManyToOne(() => Order, (order) => order.user)
    @JoinTable()
    orders: Order[];

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
