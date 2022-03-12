import { Collection, GuildChannel } from "discord.js";
import { client } from "../..";
import { Command } from "../../structures/Command";
import { ExtendedChannel } from "../../typings/Channel";
import { ExtendedMember } from "../../typings/Member";

export default new Command({
    name: "track_channel",
    description: "sets a channel to tracked",
    options: [
        //will add "is it training option" and "training name / choices lata"
        {
            name: "channel",
            description: "select a channel to track",
            type: "CHANNEL",
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const channel = await (
            interaction.options.getChannel("channel") as GuildChannel as ExtendedChannel
        ).fetch();

        if (client.trackedChannels.find((x) => x.id === channel.id)) {
            interaction.reply({ ephemeral: true, content: "Channel already tracked" });
            return;
        }
        channel.trackedMembers = new Collection();

        channel.members.forEach((member: ExtendedMember) => {
            const temp = member;
            temp.channelTime = 0;
            temp.channelJoinTime = new Date().getTime();

            channel.trackedMembers.set(member.id, temp);
            console.log(
                `<tracked channe> user: ${member.user.username} was already in the channel`,
            );
        });

        client.trackedChannels.set(channel.id, channel);

        interaction.reply({
            ephemeral: true,
            content: `Channel ${channel} is now tracked`,
        });
    },
});
