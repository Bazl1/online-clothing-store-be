import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./session.entity";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionsRepository: Repository<Session>,
    ) {}

    async getById(id: number) {
        return this.sessionsRepository.findOne({
            where: { id },
            relations: ["user", "user.address"],
        });
    }

    async create(data: Session) {
        return this.sessionsRepository.save(data);
    }

    async delete(sessionId: number) {
        return this.sessionsRepository.delete({ id: sessionId });
    }

    async validateSession(id: number) {}
}
