import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

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
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(totalItems / limit);

        return { categories, totalPages, totalItems };
    }

    async getAll() {
        return this.categoryRepository.find();
    }

    async getById(id: string) {
        return this.categoryRepository.findOne({
            where: { id },
        });
    }

    async update(id: string, data: Partial<Category>) {
        await this.categoryRepository.update(id, data);
        return this.getById(id);
    }

    async delete(id: string) {
        return this.categoryRepository.delete(id);
    }

    async deleteMany(ids: string[]) {
        return this.categoryRepository.delete(ids);
    }
}
