import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
    @Get()
    async get() {}

    @Get(":id")
    async getById() {}

    @Post()
    async create() {}

    @Patch(":id")
    async update() {}

    @Delete(":id")
    async delete() {}
}
