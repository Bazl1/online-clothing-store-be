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
import { Category } from "@/models/categories/category.entity";
import { Comment } from "@/models/comments/comment.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    articul: string;

    @Column()
    title: string;

    @OneToMany(() => Category, (category) => category.products)
    @JoinTable()
    category: Category;

    @ManyToOne(() => Comment, (comment) => comment.product)
    @JoinTable()
    comments: Comment[];

    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    discountPrice: number;

    @Column("simple-array")
    images: string[];

    @Column()
    isActive: boolean;

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
