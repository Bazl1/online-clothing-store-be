import { SessionsService } from "@/models/sessions/sessions.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { authCookieName } from "../constants/cookie/constants";
import { RequestWithSession } from "../types/request";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
    constructor(private readonly sessionsService: SessionsService) {}

    async use(req: RequestWithSession, res: Response, next: NextFunction) {
        const sessionId = req.cookies[authCookieName] as number;

        if (sessionId) {
            const session = await this.sessionsService.getById(sessionId);
            if (session) {
                req.session = session;
            }
        }

        next();
    }
}
