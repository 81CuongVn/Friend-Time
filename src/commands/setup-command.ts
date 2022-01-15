import { ApplicationCommandData, CommandInteraction, PermissionString } from 'discord.js';

import { Command, CommandDeferType } from '.';
import { GuildData } from '../database/entities';
import { EventData } from '../models/internal-models';
import { Lang } from '../services';
import { SettingManager } from '../settings';
import { MessageUtils } from '../utils';

export class SetupCommand implements Command {
    public metadata: ApplicationCommandData = {
        name: Lang.getCom('commands.setup'),
        description: Lang.getRef('commandDescs.setup', Lang.Default),
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireGuild = true;
    public requireClientPerms: PermissionString[] = ['VIEW_CHANNEL'];
    public requireUserPerms: PermissionString[] = ['MANAGE_GUILD'];

    constructor(private guildSettingManager: SettingManager) {}

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        if (!data.guild) {
            data.guild = new GuildData();
            data.guild.discordId = intr.guild?.id;
        }

        for (let setting of this.guildSettingManager.settings) {
            let value = await setting.retrieve(intr, data);
            if (value == null) {
                return;
            }
            setting.apply(data.guild, value);
        }
        await data.guild.save();

        let settingList = this.guildSettingManager.list(data.guild, data.lang());
        await MessageUtils.sendIntr(
            intr,
            Lang.getEmbed('resultEmbeds.setupCompleted', data.lang(), {
                SETTING_LIST: settingList,
            })
        );
        return;
    }
}
