import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ValidationException } from "../exceptions/validation.exception";
import { ValidationHelper } from "../helpers/validation.helper";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            console.log(errors);
            throw new ValidationException(
                ValidationHelper.validationErrorToMessages(errors),
            );
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
