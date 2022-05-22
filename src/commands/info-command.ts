import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { CommandInteraction, PermissionString } from 'discord.js';

import { EventData } from '../models/internal-models.js';
import { Lang } from '../services/index.js';
import { InteractionUtils } from '../utils/index.js';
import { Command, CommandDeferType } from './index.js';

export class InfoCommand implements Command {
    public metadata: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        name: Lang.getCom('commands.info'),
        description: Lang.getRef('commandDescs.info', Lang.Default),
        dm_permission: true,
        default_member_permissions: undefined,
    };
    public deferType = CommandDeferType.PUBLIC;
    public requireDev = false;
    public requireClientPerms: PermissionString[] = [];
    public requireUserPerms: PermissionString[] = [];

    public async execute(intr: CommandInteraction, data: EventData): Promise<void> {
        await InteractionUtils.send(intr, Lang.getEmbed('displayEmbeds.info', data.lang()));
    }
}
