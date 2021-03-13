import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

import { GuildData } from '.';
import { DateFormatOption } from '../../models/enums';

@Entity('guild_bot')
@Unique(['guild', 'discordId'])
export class GuildBotData extends BaseEntity {
    // IDs
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 20 })
    discordId: string;

    // Settings
    @Column({ type: 'varchar', length: 32, nullable: true })
    timeZone?: string;

    @Column({ type: 'varchar', length: 9, nullable: true })
    dateFormat?: DateFormatOption;

    // Timestamps
    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    modified: Date;

    // Relations
    @ManyToOne(() => GuildData, guildData => guildData.bots, { onDelete: 'CASCADE' })
    guild: GuildData;
}