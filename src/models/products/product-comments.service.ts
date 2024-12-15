import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductComment } from "./entities/product-comment.entity";

@Injectable()
export class ProductCommentsService {
    constructor(
        @InjectRepository(ProductComment)
        private readonly productCommentsService: Repository<ProductComment>,
    ) {}

    async create(data: ProductComment) {
        return await this.productCommentsService.save(data);
    }

    async getAll(productId: string, page: number, limit: number) {
        const where: any = {
            product: {
                id: productId,
            },
        };

        const totalItems = await this.productCommentsService.count({ where });

        const totalPages = Math.ceil(totalItems / limit);

        return {
            items: await this.productCommentsService.find({
                where,
                take: limit,
                skip: (page - 1) * limit,
            }),
            totalItems,
            totalPages,
        };
    }

    async getById(productCommentId: string) {
        return await this.productCommentsService.find({
            where: {
                id: productCommentId,
            },
        });
    }

    async update(productCommentId: string, data: Partial<ProductComment>) {
        if (!(await this.getById(productCommentId))) {
            throw new Error("Product comment not found");
        }

        return this.productCommentsService.update(productCommentId, data);
    }

    async delete(productCommentId: string) {
        return this.productCommentsService.delete(productCommentId);
    }

    async deleteMany(productCommentIds: string[]) {
        return this.productCommentsService.delete(productCommentIds);
    }
}
