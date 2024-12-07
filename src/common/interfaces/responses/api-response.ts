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
    totalPages?: number;

    @ApiProperty({ nullable: true })
    totalItems?: number;
}

export function createApiOkResponse<TData>(
    data?: TData,
    page?: number,
    totalPages?: number,
    totalItems?: number,
    message?: string,
): ApiResponse<TData> {
    const response = new ApiResponse<TData>();
    response.success = true;
    response.message = message;
    response.page = page;
    response.totalPages = totalPages;
    response.totalItems = totalItems;
    response.data = data;
    return response;
}

export function createApiOkSingleResponse<TData>(
    data?: TData,
    message?: string,
): ApiResponse<TData> {
    const response = new ApiResponse<TData>();
    response.success = true;
    response.message = message;
    response.data = data;
    return response;
}

export function createApiOkMessageResponse(message?: string) {
    const response = new ApiResponse();
    response.success = true;
    response.message = message;
    return response;
}
