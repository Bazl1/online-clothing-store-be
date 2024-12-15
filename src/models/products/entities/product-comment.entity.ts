import { User } from "@/models/users/entities/user.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Product } from "./product.entity";

@Entity("product-comments")
export class ProductComment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    comment: string;

    @ManyToOne(() => Product, (product) => product.productComments)
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

    constructor(dto: Partial<ProductComment>) {
        Object.assign(this, dto);
    }
}
