import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserResetPasswordDto } from "./dtos/user-reset-password.dto";
import { PasswordService } from "./password.service";
import { AddressesService } from "./addresses.service";
import { Address } from "./entities/address.entity";
import { UpdateUserWithAddressDto } from "./dtos/update-user-with-address.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly passwordService: PasswordService,
        private readonly addressesService: AddressesService,
    ) {}

    async deleteMany(ids: string[]) {
        return this.usersRepository.delete(ids);
    }

    async search(query: string | undefined, page: number, limit: number) {
        const qb = this.usersRepository.createQueryBuilder("user");

        if (query) {
            qb.where(
                "user.firstName ILIKE :query OR user.lastName ILIKE :query",
                { query: `%${query}%` },
            ).relation("address");
        }

        const [users, totalItems] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        return { users, totalPages, totalItems };
    }

    async count() {
        return this.usersRepository.count();
    }

    async getByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async getById(id: string) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ["address"],
        });
    }

    async create(data: User) {
        return this.usersRepository.save(data);
    }

    async update(id: string, data: Partial<User>) {
        await this.usersRepository.update(id, data);
        return this.getById(id);
    }

    async updateUserWithAddress(
        userId: string,
        data: UpdateUserWithAddressDto,
    ) {
        const user = await this.getById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        await this.update(user.id, {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            email: data.email,
        });

        await this.addressesService.createOrUpdate(
            {
                state: data.state,
                country: data.country,
                city: data.city,
                street: data.street,
                house: data.house,
                flat: data.flat,
                floor: data.floor,
            },
            user,
        );

        return this.getById(userId);
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
