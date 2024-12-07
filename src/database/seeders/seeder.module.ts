import { Module } from "@nestjs/common";
import { UsersSeederModule } from "./users/users.module";
import { Seeder } from "./seeder";

@Module({
    imports: [UsersSeederModule],
    providers: [Seeder],
    exports: [Seeder],
})
export class SeederModule {}
