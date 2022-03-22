import { GuildMember } from "discord.js";

export interface ExtendedMember extends GuildMember {
    channelTime: number;
    channelJoinTime: number;
}
