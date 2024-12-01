export interface IDatabaseConfig {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
}
