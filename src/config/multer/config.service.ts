import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    MulterModuleOptions,
    MulterOptionsFactory,
} from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    readonly DEFAULT_UPLOADS_DEST = "./uploads";

    constructor(private readonly configService: ConfigService) {}

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (
                    req: Express.Request,
                    file: Express.Multer.File,
                    cb: (error: Error | null, destination: string) => void,
                ) => {
                    const dest = path.join(
                        process.cwd(),
                        this.configService.get("UPLOADS_DEST") ??
                            this.DEFAULT_UPLOADS_DEST,
                    );
                    cb(null, dest);
                },
                filename: (
                    req: Express.Request,
                    file: Express.Multer.File,
                    cb: (error: Error | null, filename: string) => void,
                ) => {
                    const ext = path.extname(file.originalname);
                    const uniqueName = `${uuidv4()}${ext}`;
                    cb(null, uniqueName);
                },
            }),
        };
    }
}
