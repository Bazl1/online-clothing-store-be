import { UsersService } from "@/models/users/users.service";
import data from "./data";
import { Injectable } from "@nestjs/common";
import { PasswordService } from "@/models/users/password.service";

@Injectable()
export class UsersSeederService {
    constructor(
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService,
    ) {}

    async seed() {
        if ((await this.usersService.count()) !== 0) {
            return;
        }

        data.forEach(async (user) => {
            user.password = await this.passwordService.hashPassword(
                user.password,
            );

            await this.usersService.create(user);
        });
    }
}
