import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { AddressResponseDto } from "./address-response.dto";
import { UserRole } from "../entities/user.entity";

export class UserResponseDto {
    @ApiProperty()
    @Expose()
    id: string;

    @ApiProperty()
    @Expose()
    firstName: string;

    @ApiProperty()
    @Expose()
    lastName: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    role: UserRole;

    @ApiProperty()
    @Type(() => AddressResponseDto)
    @Expose()
    address: AddressResponseDto;

    @ApiProperty()
    @Expose()
    createdAt: Date;

    @ApiProperty()
    @Expose()
    updatedAt: Date;
}
