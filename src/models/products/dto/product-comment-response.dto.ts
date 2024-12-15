import { UserResponseDto } from "@/models/users/dtos/user-response.dto";
import { Expose, Type } from "class-transformer";

export class ProductCommentResponseDto {
    @Expose()
    id: string;

    @Expose()
    comment: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
