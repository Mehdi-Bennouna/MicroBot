import { GuildChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedChannel } from "../../typings/Channel";

export default new Command({
    name: "log_channel",
    description: "console logs a channel",
    options: [
        {
            name: "channel",
            description: "channel to log",
            type: "CHANNEL",
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const channel = await (
            interaction.options.getChannel("channel") as GuildChannel as ExtendedChannel
        ).fetch();

        console.table(
            channel.trackedMembers.map((x) => {
                return {
                    username: x.user.username,
                    joinTime: x.channelJoinTime,
                    TotalTime: x.channelTime,
                };
            }),
        );
         
        interaction.reply({ ephemeral: true, content: "logged" });
    },
});
