import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(partial: Partial<Category>) {
        return this.categoryRepository.save(partial);
    }

    async search(query: string | undefined, page: number, limit: number) {
        const db = this.categoryRepository.createQueryBuilder("category");

        if (query) {
            db.where(
                "category.title LIKE :query OR category.description ILIKE :query",
                {
                    query: `%${query}%`,
                },
            );
        }

        const [categories, totalItems] = await db
            .orderBy("category.createdAt", "DESC")
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        return { categories, totalPages, totalItems };
    }

    async getAll() {
        return this.categoryRepository.find({
            order: { createdAt: "DESC" },
        });
    }

    async getById(id: string) {
        return this.categoryRepository.findOne({
            where: { id },
        });
    }

    async getByIds(ids: string[]) {
        return this.categoryRepository.find({
            where: {
                id: In(ids),
            },
            order: { createdAt: "DESC" },
        });
    }

    async update(id: string, data: Partial<Category>) {
        await this.categoryRepository.update(id, data);
        return this.getById(id);
    }

    async updateMany(ids: string[], data: Partial<Category>) {
        await this.categoryRepository.update(ids, data);
        return this.getByIds(ids);
    }

    async delete(id: string) {
        return this.categoryRepository.delete(id);
    }

    async deleteMany(ids: string[]) {
        return this.categoryRepository.delete(ids);
    }

    async getCatalog(limit?: number) {
        return this.categoryRepository.find({
            where: { isActive: true },
            order: { createdAt: "DESC" },
            ...(limit !== 0 && { take: limit }),
        });
    }
}
