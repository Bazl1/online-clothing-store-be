import { IsString, IsUUID } from "class-validator";

export class ProductCommentCreateDto {
    @IsUUID()
    productId: string;

    @IsString()
    comment: string;
}
