import { ShardingManager } from 'discord.js';

import { ShardingConfig } from './models/config-models';
import { Logs } from './models/logs';
import { Logger } from './services';
import { BotSite } from './services/sites';

let Logs: Logs = require('../lang/logs.en.json');

export class Manager {
    constructor(
        private shardingConfig: ShardingConfig,
        private shardManager: ShardingManager,
        private botSites: BotSite[]
    ) {}

    public async start(): Promise<void> {
        this.registerListeners();
        try {
            await this.shardManager.spawn(
                this.shardManager.totalShards,
                this.shardingConfig.spawnDelay * 1000,
                this.shardingConfig.spawnTimeout * 1000
            );
        } catch (error) {
            Logger.error(Logs.spawnShardError, error);
            return;
        }
        this.updateServerCount();
    }

    public async updateServerCount(): Promise<void> {
        let serverCount: number;
        try {
            serverCount = await this.retrieveServerCount();
        } catch (error) {
            Logger.error(Logs.retrieveServerCountError, error);
            return;
        }
        try {
            await this.shardManager.broadcastEval(`
            this.user.setPresence({
                activity: {
                    name: 'time to ${serverCount.toLocaleString()} servers',
                    type: "STREAMING",
                    url: "https://www.twitch.tv/monstercat"
                }
            });
        `);
        } catch (error) {
            Logger.error(Logs.broadcastServerCountError, error);
        }

        Logger.info(
            Logs.updatedServerCount.replace('{SERVER_COUNT}', serverCount.toLocaleString())
        );

        for (let botSite of this.botSites) {
            if (!botSite.enabled) {
                continue;
            }

            try {
                await botSite.updateServerCount(serverCount);
            } catch (error) {
                Logger.error(
                    Logs.updateServerCountSiteError.replace('{BOT_SITE}', botSite.name),
                    error
                );
                continue;
            }

            Logger.info(Logs.updateServerCountSite.replace('{BOT_SITE}', botSite.name));
        }
    }

    private async retrieveServerCount(): Promise<number> {
        let shardSizes: number[];
        try {
            shardSizes = await this.shardManager.fetchClientValues('guilds.cache.size');
        } catch (error) {
            throw error;
        }
        return shardSizes.reduce((prev, val) => prev + val, 0);
    }

    private registerListeners(): void {
        this.shardManager.on('shardCreate', shard => this.onShardCreate(shard));
    }

    private onShardCreate(shard: import('discord.js').Shard): void {
        Logger.info(Logs.launchedShard.replace('{SHARD_ID}', shard.id.toString()));
    }
}
