import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map } from "rxjs";
import { ApiResponse } from "../interfaces/responses/api-response";

export interface ClassContrustor {
    new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassContrustor) {}

    intercept(context: ExecutionContext, handler: CallHandler) {
        return handler.handle().pipe(
            map(({ data, ...otherProps }: ApiResponse<typeof this.dto>) => {
                return {
                    ...otherProps,
                    data: plainToClass(this.dto, data, {
                        excludeExtraneousValues: true,
                        exposeUnsetFields: false,
                    }),
                } as ApiResponse<typeof this.dto>;
            }),
        );
    }
}
