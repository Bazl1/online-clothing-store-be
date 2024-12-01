import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserResetPasswordDto } from "./dtos/user-reset-password.dto";
import { PasswordService } from "./password.service";
import { AddressesService } from "./addresses.service";
import { Address } from "./entities/address.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly passwordService: PasswordService,
        private readonly addressesService: AddressesService,
    ) {}

    async search(query: string | undefined, page: number, limit: number) {
        const qb = this.usersRepository.createQueryBuilder("user");

        if (query) {
            qb.where(
                "user.firstName ILIKE :query OR user.lastName ILIKE :query",
                { query: `%${query}%` },
            );
        }

        const [users, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return { users, totalPages };
    }

    async getByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async getById(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async create(data: User) {
        return this.usersRepository.save(data);
    }

    async update(id: string, data: Partial<User>) {
        await this.usersRepository.update(id, data);
        return this.getById(id);
    }

    async createAddressOrUpdateAddress(user: User, data: Partial<Address>) {
        await this.addressesService.createOrUpdate(data, user);
        return this.getById(user.id);
    }

    async delete(id: string) {
        await this.usersRepository.delete(id);
        return;
    }

    async updatePassword(id: string, data: UserResetPasswordDto) {
        if (
            !this.passwordService.comparePasswords(
                data.password,
                data.newPassword,
            )
        ) {
            throw new Error(
                "New password must be different from the current one",
            );
        }

        return this.update(id, {
            password: await this.passwordService.hashPassword(data.newPassword),
        });
    }
}
