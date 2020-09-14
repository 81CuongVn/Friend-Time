import { TopGgConfig } from '../../models/config-models';
import { HttpService } from '../http-service';
import { BotSite } from './bot-site';

export class TopGgSite implements BotSite {
    public enabled = false;
    public name = 'top.gg';

    constructor(private config: TopGgConfig, private httpService: HttpService) {
        this.enabled = this.config.enabled;
    }

    public async updateServerCount(serverCount: number): Promise<void> {
        try {
            await this.httpService.post(
                this.config.url,
                { server_count: serverCount },
                this.config.token
            );
        } catch (error) {
            throw error;
        }
    }
}
