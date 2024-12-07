import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
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
            throw new UnauthorizedException("You are not authenticated");
        }

        if (session.isExpired()) {
            throw new UnauthorizedException("Session expired");
        }

        return true;
    }
}
