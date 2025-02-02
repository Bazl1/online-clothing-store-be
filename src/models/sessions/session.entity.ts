import { User } from "@/models/users/entities/user.entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("sessions")
export class Session {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ name: "expires_at", type: "timestamp" })
    expiresAt: Date;

    isExpired() {
        return this.expiresAt.getTime() < Date.now();
    }

    constructor(partial: Partial<Session>) {
        Object.assign(this, partial);
    }
}
