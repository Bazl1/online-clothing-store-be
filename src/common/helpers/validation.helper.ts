import { ValidationError } from "class-validator";

export class ValidationHelper {
    static validationErrorToMessages(validationErrors: ValidationError[]) {
        return validationErrors.reduce(
            (acc, error) => ({
                ...acc,
                [error.property]: Object.values(error.constraints),
            }),
            {},
        );
    }
}
