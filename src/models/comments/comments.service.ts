import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
    ) {}

    async create(data: Comment) {
        return await this.commentsRepository.save(data);
    }

    async getAll(productId: string, page: number, limit: number) {
        const where: any = {
            product: {
                id: productId,
            },
        };

        const totalItems = await this.commentsRepository.count({ where });

        const totalPages = Math.ceil(totalItems / limit);

        return {
            items: await this.commentsRepository.find({
                where,
                take: limit,
                skip: (page - 1) * limit,
            }),
            totalItems,
            totalPages,
        };
    }

    async getById(productCommentId: string) {
        return await this.commentsRepository.find({
            where: {
                id: productCommentId,
            },
        });
    }

    async update(productCommentId: string, data: Partial<Comment>) {
        if (!(await this.getById(productCommentId))) {
            throw new Error("Product comment not found");
        }

        return this.commentsRepository.update(productCommentId, data);
    }

    async delete(productCommentId: string) {
        return this.commentsRepository.delete(productCommentId);
    }

    async deleteMany(productCommentIds: string[]) {
        return this.commentsRepository.delete(productCommentIds);
    }
}
