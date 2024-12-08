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
import { ProductComment } from "./product-comment.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @OneToMany(() => ProductComment, (productComment) => productComment.product)
    @JoinTable()
    productComments: ProductComment[];

    @Column()
    description: string;

    @Column()
    price: number;

    @Column("simple-array")
    images: string[];

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

    constructor(partial: Partial<Product>) {
        Object.assign(this, partial);
    }
}
