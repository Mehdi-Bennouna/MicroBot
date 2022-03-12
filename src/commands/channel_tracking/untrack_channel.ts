import { GuildChannel } from "discord.js";
import { client } from "../..";
import { Command } from "../../structures/Command";
import { ExtendedChannel } from "../../typings/Channel";

export default new Command({
    name: "untrack_channel",
    description: "remove a channel from tracked and get report",
    run: async ({ interaction }) => {
        const channel = await (
            interaction.options.getChannel("channel") as GuildChannel as ExtendedChannel
        ).fetch();

        if (!client.trackedChannels.find((x) => x.id === channel.id)) {
            interaction.reply({ ephemeral: true, content: "Channel not tracked yet" });
            return;
        }

        client.trackedChannels.delete(channel.id);

        interaction.reply({
            ephemeral: true,
            content: `Channel ${channel} no longer tracked`,
        });
    },
});
