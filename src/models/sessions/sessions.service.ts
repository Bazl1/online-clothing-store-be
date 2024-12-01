import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionsService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionsRepository: Repository<Session>,
    ) {}

    async getById(id: string) {
        return this.sessionsRepository.findOne({
            where: { id },
            relations: ["user"],
        });
    }

    async create(data: Session) {
        return this.sessionsRepository.save(data);
    }

    async delete(sessionId: string) {
        return this.sessionsRepository.delete({ id: sessionId });
    }

    async validateSession(id: string) {}
}
