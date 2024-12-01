import { availableSessionTime_EN } from "@/common/constants/auth/en.constants";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SessionConfig {
    availableSessionTime: number;

    constructor(private readonly configService: ConfigService) {
        this.availableSessionTime = parseInt(
            this.configService.get(availableSessionTime_EN),
        );
    }
}
