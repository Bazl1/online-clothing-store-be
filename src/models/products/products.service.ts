import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Between,
    LessThanOrEqual,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(data: Product) {
        return this.productRepository.save(data);
    }

    async getAll(
        search: string,
        page: number,
        limit: number,
        maxPrice?: number,
        minPrice?: number,
        sort: "price-asc" | "price-desc" = "price-asc",
    ) {
        const where: any = {};

        if (search) {
            where.name = Like(`%${search}%`);
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = Between(minPrice, maxPrice);
        } else if (minPrice !== undefined) {
            where.price = MoreThanOrEqual(minPrice);
        } else if (maxPrice !== undefined) {
            where.price = LessThanOrEqual(maxPrice);
        }

        const totalItems = await this.productRepository.count({ where });

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.productRepository.find({
            where,
            order: {
                price: sort === "price-asc" ? "ASC" : "DESC",
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            items,
            totalItems,
            totalPages,
        };
    }

    async getById(id: string) {
        return this.productRepository.findOne({
            where: { id },
            relations: ["images"],
        });
    }

    async update(id: string, product: Partial<Product>) {
        await this.productRepository.update(id, product);
        return this.getById(id);
    }

    async deleteMany(ids: string[]) {
        return this.productRepository.delete(ids);
    }

    async delete(id: string) {
        await this.productRepository.delete(id);
    }
}
