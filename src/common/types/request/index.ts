import { Session } from "@/models/sessions/session.entity";
import { CookieOptions, Request as ExpressRequest } from "express";

export type Request = ExpressRequest & {
    cookie: (name: string, value: string, options?: CookieOptions) => void;
};

export type RequestWithSession = Request & {
    session?: Session;
};
