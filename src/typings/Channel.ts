import { Collection, GuildChannel } from "discord.js";
import { ExtendedMember } from "./Member";

export interface ExtendedChannel extends GuildChannel {
    trackedMembers: Collection<string, ExtendedMember>;
}
