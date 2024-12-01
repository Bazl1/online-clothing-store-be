import { ApiProperty } from "@nestjs/swagger";

export class ApiResponse<TData = Object> {
    @ApiProperty({ nullable: true })
    errorType?: "validation" | "error";

    @ApiProperty()
    success: boolean;

    @ApiProperty({ nullable: true })
    messages?: Record<string, string[]>;

    @ApiProperty({ nullable: true })
    message?: string;

    @ApiProperty({ nullable: true, type: Object })
    data?: TData;

    @ApiProperty({ nullable: true })
    page?: number;

    @ApiProperty({ nullable: true })
    totalPage?: number;
}

export function createApiOkResponse<TData>(
    data?: TData,
    page?: number,
    totalPage?: number,
    message?: string,
): ApiResponse<TData> {
    const response = new ApiResponse<TData>();
    response.success = true;
    response.message = message;
    response.page = page;
    response.totalPage = totalPage;
    response.data = data;
    return response;
}
