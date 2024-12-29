import { User } from "@/models/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Product } from "../products/product.entity";

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    comment: string;

    @OneToMany(() => Product, (product) => product.comments)
    @JoinTable()
    product: Product;

    @OneToMany(() => User, (user) => user.id)
    @JoinTable()
    user: User;

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

    constructor(dto: Partial<Comment>) {
        Object.assign(this, dto);
    }
}
