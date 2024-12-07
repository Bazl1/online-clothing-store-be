import { Module } from "@nestjs/common";
import { UsersSeederService } from "./users.service";
import { UsersModule } from "@/models/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [UsersSeederService],
    exports: [UsersSeederService],
})
export class UsersSeederModule {}
