import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { GlobalExceptionFilter } from "./common/filters/global-error-filter";
import { ValidationPipe } from "./common/pipes/validation.pipe";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Seeder } from "./database/seeders/seeder";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.get(Seeder).seed();

    const configService = app.get(ConfigService);

    app.enableCors({
        origin: configService.get("ORIGINS_ALLOWED") ?? "http://localhost:3000",
        credentials: true,
    });

    app.use(cookieParser());

    app.setGlobalPrefix("api");

    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder().setTitle("API").build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, documentFactory);

    await app.listen(configService.get<number>("APP_PORT") ?? 3000);
}

bootstrap();
