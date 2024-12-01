// session.guard.ts
import { SessionsService } from "@/models/sessions/sessions.service";
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from "@nestjs/common";
import { RequestWithSession } from "../types/request";

@Injectable()
export class SessionGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context
            .switchToHttp()
            .getRequest() as RequestWithSession;

        const session = request.session;

        if (!session || !session.user) {
            throw new ForbiddenException("You are not authenticated");
        }

        if (session.isExpired()) {
            throw new ForbiddenException("Session expired");
        }

        return true;
    }
}
