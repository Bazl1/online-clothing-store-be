import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from "@nestjs/common";
import { ApiResponse } from "../interfaces/responses/api-response";
import { ValidationException } from "../exceptions/validation.exception";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status =
            exception instanceof HttpException ? exception.getStatus() : 500;

        const data = new ApiResponse();
        data.success = false;
        data.errorType = "error";

        console.log(exception);

        if (exception instanceof ValidationException) {
            data.messages = exception.messages;
            data.errorType = "validation";
        } else if (exception instanceof Error) {
            data.message = exception.message;
        } else {
            data.message = "Internal server error";
        }

        response.status(status).json(data);
    }
}
