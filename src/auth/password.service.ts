import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class PasswordService {
    private readonly saltRounds = 10;

    async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    async comparePasswords(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }
}
