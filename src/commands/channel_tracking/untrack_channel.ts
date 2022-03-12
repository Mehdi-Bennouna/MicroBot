import { GuildChannel } from "discord.js";
import { client } from "../..";
import { Command } from "../../structures/Command";
import { ExtendedChannel } from "../../typings/Channel";

export default new Command({
    name: "untrack_channel",
    description: "remove a channel from tracked and get report",
    options: [
        {
            name: "channel",
            description: "channel to untrack",
            type: "CHANNEL",
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const channel = await (
            interaction.options.getChannel("channel") as GuildChannel as ExtendedChannel
        ).fetch();

        if (!client.trackedChannels.find((x) => x.id === channel.id)) {
            interaction.reply({ ephemeral: true, content: "Channel not tracked yet" });
            return;
        }

        const currentTime = new Date().getTime();

        channel.members.forEach((member) => {
            const temp = client.trackedChannels
                .get(channel.id)
                .trackedMembers.get(member.id);

            temp.channelTime += currentTime - temp.channelJoinTime;
        });

        console.log(`${channel.name} Log: -------`);
        console.table(
            channel.trackedMembers.map((x) => {
                return { username: x.user.username, Time: x.channelTime / 1000 };
            }),
        );

        client.trackedChannels.delete(channel.id);

        interaction.reply({
            ephemeral: true,
            content: `Channel ${channel} no longer tracked`,
        });
    },
});
