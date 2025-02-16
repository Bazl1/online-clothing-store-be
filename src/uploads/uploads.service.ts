import * as path from "path";
import * as fs from "fs";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadsService {
    readonly DEFAULT_UPLOADS_DEST = "./uploads";

    constructor(private readonly configService: ConfigService) {}

    deleteFile(fileName: string) {
        const filePath = path.join(
            process.cwd(),
            this.configService.get("UPLOADS_DEST") ?? this.DEFAULT_UPLOADS_DEST,
            fileName,
        );

        return fs.unlinkSync(filePath);
    }
}
