import {
    ClassContrustor,
    SerializeInterceptor,
} from "@/common/interceptors/serialize.interceptor";
import { UseInterceptors } from "@nestjs/common";

export function Serialize(dto: ClassContrustor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}
