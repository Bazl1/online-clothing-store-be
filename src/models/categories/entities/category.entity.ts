import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    constructor(partial: Partial<Category>) {
        Object.assign(this, partial);
    }
}
