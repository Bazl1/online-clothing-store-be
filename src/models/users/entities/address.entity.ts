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
    @PrimaryGeneratedColumn("uuid")
    id: string;

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
    floor: number;

    @Column()
    zip: number;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;

    constructor(partial: Partial<Address>) {
        Object.assign(this, partial);
    }
}
