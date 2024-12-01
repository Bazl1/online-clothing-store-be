import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/session.entity";
import { UsersModule } from "../users/users.module";
import { SessionsService } from "./sessions.service";

@Module({
    imports: [TypeOrmModule.forFeature([Session])],
    controllers: [],
    providers: [SessionsService],
    exports: [SessionsService],
})
export class SessionsModule {}
