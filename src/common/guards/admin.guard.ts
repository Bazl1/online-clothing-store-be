import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
} from "@nestjs/common";
import { RequestWithSession } from "../types/request";
import { UserRole } from "@/models/users/entities/user.entity";

@Injectable()
export class AdminGuard implements CanActivate {
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

        if (session.user.role !== UserRole.ADMIN) {
            throw new ForbiddenException(
                "You are not authorized to access this resource",
            );
        }

        return true;
    }
}
