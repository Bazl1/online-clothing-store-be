import { IsNotEmpty, IsString } from "class-validator";

export class CommentCreateDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    comment: string;
}
