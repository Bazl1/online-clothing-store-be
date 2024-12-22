import { MulterConfigService } from "@/config/multer/config.service";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import {
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("Files")
@Controller("files")
export class FilesController {
    constructor(private readonly multerConfigService: MulterConfigService) {}

    @ApiOkResponse()
    @ApiNotFoundResponse()
    @ApiParam({ name: "fileName", type: String })
    @Get(":fileName")
    async get(@Param("fileName") filename: string) {
        const filePath = path.join(
            this.multerConfigService.DEFAULT_UPLOADS_DEST,
            filename,
        );

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException("File not found");
        }

        return fs.createReadStream(filePath);
    }
}
