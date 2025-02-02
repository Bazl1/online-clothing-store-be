import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AddressesService {
    constructor(
        @InjectRepository(Address)
        private readonly addressesRepository: Repository<Address>,
    ) {}

    async getById(id: number) {
        return this.addressesRepository.findOne({
            where: { id },
            relations: ["user"],
        });
    }

    async create(data: Partial<Address>, user: User) {
        data.user = user;
        return this.addressesRepository.save(data);
    }

    async update(id: number, data: Partial<Address>) {
        await this.addressesRepository.update(id, data);
        return this.getById(id);
    }

    async createOrUpdate(data: Partial<Address>, user: User) {
        if (user.address) {
            return this.update(user.address.id, data);
        }

        return this.create(data, user);
    }

    async delete(id: number) {
        return this.addressesRepository.delete(id);
    }
}
