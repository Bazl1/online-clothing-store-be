import { OrderItemCreateDto } from "./order-item-create.dto";

export class OrderCreateDto {
    country: string;

    state: string;

    city: string;

    street: string;

    house: string;

    flat: string;

    floor: string;

    zip: string;

    items: OrderItemCreateDto[];
}
