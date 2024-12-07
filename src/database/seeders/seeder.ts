import { Injectable } from "@nestjs/common";
import { UsersSeederService } from "./users/users.service";

@Injectable()
export class Seeder {
    constructor(private readonly usersSeederService: UsersSeederService) {}

    async seed() {
        await this.usersSeederService.seed();
    }
}
