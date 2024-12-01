import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException {
    constructor(readonly messages: Record<string, string[]>) {
        super(undefined, HttpStatus.BAD_REQUEST);
        this.name = "ValidationException";
    }
}
