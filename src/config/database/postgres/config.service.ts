import {
    host_EN,
    port_EN,
    username_EN,
    password_EN,
    database_EN,
} from "@/common/constants/database/postgres/en.constants";
import { IDatabaseConfig } from "@/common/interfaces/database/config-service.interface";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PostgresDatabaseConfig implements IDatabaseConfig {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: boolean;
    synchronize: boolean;

    constructor(private readonly configService: ConfigService) {
        this.type = "postgres";
        this.host = this.configService.get<string>(host_EN);
        this.port = this.configService.get<number>(port_EN);
        this.username = this.configService.get<string>(username_EN);
        this.password = this.configService.get<string>(password_EN);
        this.database = this.configService.get<string>(database_EN);
        this.autoLoadEntities = true;
        this.synchronize = true;
    }
}
