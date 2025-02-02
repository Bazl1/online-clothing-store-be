import { User } from "@/models/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("addresses")
export class Address {
    @PrimaryGeneratedColumn("increment")
    id: number;

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

    @OneToOne(() => User, (user) => user.address, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    user: User;

    constructor(partial: Partial<Address>) {
        Object.assign(this, partial);
    }
}
