import { authCookieName } from "../constants/cookie/constants";
import { Request } from "../types/request";
import { Response } from "../types/response";

export class AuthCookieHelper {
    static setAuthCookie(res: Request, sid: number, expiresAt: Date) {
        res.cookie(authCookieName, sid.toString(), {
            httpOnly: true,
            expires: expiresAt,
        });
    }

    static clearAuthCookie(res: Response) {
        res.clearCookie(authCookieName);
    }
}
