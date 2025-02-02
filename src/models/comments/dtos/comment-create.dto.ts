import { IsNotEmpty, IsString } from "class-validator";

export class CommentCreateDto {
    @IsNotEmpty()
    productId: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
