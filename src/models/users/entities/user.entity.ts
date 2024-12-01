import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinTable,
} from "typeorm";
import { Address } from "./address.entity";

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

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

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
