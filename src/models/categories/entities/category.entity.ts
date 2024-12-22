import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "boolean",
        default: true,
    })
    isActive: boolean;

    @Column()
    iconUrl: string;

    @Column()
    title: string;

    @Column()
    description: string;

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

    constructor(partial: Partial<Category>) {
        Object.assign(this, partial);
    }
}
