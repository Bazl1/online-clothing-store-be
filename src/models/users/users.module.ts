import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { ProfileController } from "./profile.controller";
import { Address } from "./entities/address.entity";
import { PasswordService } from "./password.service";
import { AddressesService } from "./addresses.service";
import { UsersController } from "./users.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User, Address])],
    controllers: [ProfileController, UsersController],
    providers: [UsersService, PasswordService, AddressesService],
    exports: [UsersService],
})
export class UsersModule {}
