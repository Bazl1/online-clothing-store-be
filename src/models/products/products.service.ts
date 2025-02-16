import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Between,
    In,
    LessThanOrEqual,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { Product } from "./product.entity";
import { UploadsService } from "@/uploads/uploads.service";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly uploadsService: UploadsService,
    ) {}

    async create(data: Product) {
        return this.productRepository.save(data);
    }

    async catalogGetAll(
        search: string,
        page: number,
        limit: number,
        maxPrice?: number,
        minPrice?: number,
        sort:
            | "price-asc"
            | "price-desc"
            | "created-desc"
            | "created-asc" = "created-asc",
        categoryIds?: string[],
    ) {
        const queryBuilder = this.productRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.category", "category"); // Правильный join

        queryBuilder.where("product.isActive = :isActive", { isActive: true });

        if (search) {
            queryBuilder.andWhere("product.title ILIKE :search", {
                search: `%${search}%`,
            });
        }

        if (categoryIds && categoryIds.length) {
            queryBuilder.andWhere("product.categoryId IN (:...categoryIds)", {
                categoryIds,
            });
        }

        if (minPrice !== undefined) {
            queryBuilder.andWhere(
                "(COALESCE(product.discountPrice, product.price) >= :minPrice)",
                { minPrice },
            );
        }

        if (maxPrice !== undefined) {
            queryBuilder.andWhere(
                "(COALESCE(product.discountPrice, product.price) <= :maxPrice)",
                { maxPrice },
            );
        }

        queryBuilder.andWhere("category.isActive = :isActive", {
            isActive: true,
        });

        if (sort === "price-asc" || sort === "price-desc") {
            queryBuilder.orderBy(
                "product.price",
                sort === "price-asc" ? "ASC" : "DESC",
            );
        } else if (sort === "created-asc" || sort === "created-desc") {
            queryBuilder.orderBy(
                "product.createdAt",
                sort === "created-asc" ? "ASC" : "DESC",
            );
        }

        const totalItems = await queryBuilder.getCount();

        const totalPages = Math.ceil(totalItems / limit);

        const items = await queryBuilder
            .take(limit)
            .skip((page - 1) * limit)
            .getMany();

        return {
            items,
            totalItems,
            totalPages,
        };
    }

    async getAll(
        search: string,
        page: number,
        limit: number,
        maxPrice?: number,
        minPrice?: number,
        sort:
            | "price-asc"
            | "price-desc"
            | "created-desc"
            | "created-asc" = "created-asc",
        isActive?: boolean,
        categoryIds?: string[],
    ) {
        const where: any = {};

        if (search) {
            where.title = Like(`%${search}%`);
        }

        if (minPrice !== undefined) {
            where.price = MoreThanOrEqual(minPrice);
        }

        if (maxPrice !== undefined) {
            where.price = LessThanOrEqual(maxPrice);
        }

        if (minPrice !== undefined && maxPrice !== undefined) {
            where.price = Between(minPrice, maxPrice);
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (categoryIds && categoryIds.length) {
            where.category = In(categoryIds);
        }

        const totalItems = await this.productRepository.count({ where });

        const totalPages = Math.ceil(totalItems / limit);

        const items = await this.productRepository.find({
            where,
            order: {
                ...((sort === "price-asc" || sort === "price-desc") && {
                    price: sort === "price-asc" ? "ASC" : "DESC",
                }),
                ...((sort === "created-asc" || sort === "created-desc") && {
                    createdAt: sort === "created-asc" ? "ASC" : "DESC",
                }),
            },
            take: limit,
            skip: (page - 1) * limit,
            relations: ["category"],
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
            relations: ["category", "comments"],
        });
    }

    async getByIds(ids: string[]) {
        return this.productRepository.find({
            where: { id: In(ids) },
            order: {
                createdAt: "ASC",
            },
            relations: ["category", "comments"],
        });
    }

    async catalogGetById(id: string) {
        return this.productRepository.findOne({
            where: { id, isActive: true },
            relations: ["category", "comments"],
        });
    }

    async catalogGetByIds(ids: string[]) {
        return this.productRepository.find({
            where: { id: In(ids), isActive: true },
            order: {
                createdAt: "ASC",
            },
            relations: ["category", "comments"],
        });
    }

    async update(id: string, product: Partial<Product>) {
        await this.productRepository.update(id, product);
        return this.getById(id);
    }

    async updateMany(ids: string[], product: Partial<Product>) {
        return this.productRepository.update(ids, product);
    }

    async updateWithImages(
        id: string,
        productUpdatedData: Partial<Product>,
        deletedFileNames: string[],
        uploadedFileNames: string[],
    ) {
        const product = await this.getById(id);

        if (!product) {
            throw new NotFoundException("Product not found");
        }

        await this.productRepository.update(id, {
            ...productUpdatedData,
            images: product.images
                .filter((fileName) => !deletedFileNames.includes(fileName))
                .concat(uploadedFileNames),
        });

        return this.getById(id);
    }

    async deleteMany(ids: string[]) {
        // const product = await this.productRepository.find({
        //     where: {
        //         id: In(ids),
        //     },
        // });

        // product.flatMap((p) => p.images).map(this.uploadsService.deleteFile);

        return this.productRepository.delete(ids);
    }

    async delete(id: string) {
        // const product = await this.productRepository.findOne({
        //     where: {
        //         id,
        //     },
        // });

        // product.images.map(this.uploadsService.deleteFile);

        return this.productRepository.delete(id);
    }
}
