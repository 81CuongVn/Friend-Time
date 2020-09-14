import { BotsOnDiscordXyzConfig } from '../../models/config-models';
import { HttpService } from '../http-service';
import { BotSite } from './bot-site';

export class BotsOnDiscordXyzSite implements BotSite {
    public enabled = false;
    public name = 'bots.ondiscord.xyz';

    constructor(private config: BotsOnDiscordXyzConfig, private httpService: HttpService) {
        this.enabled = this.config.enabled;
    }

    public async updateServerCount(serverCount: number): Promise<void> {
        try {
            await this.httpService.post(
                this.config.url,
                { guildCount: serverCount },
                this.config.token
            );
        } catch (error) {
            throw error;
        }
    }
}
