import {
    Column,
    CreateDateColumn,
    Entity,
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

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => Comment, (comment) => comment.product)
    comments: Comment[];

    @Column({
        nullable: true,
    })
    description?: string;

    @Column()
    price: number;

    @Column({
        nullable: true,
    })
    discountPrice?: number;

    @Column("simple-array")
    images: string[];

    @Column({
        type: "boolean",
        default: true,
    })
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
