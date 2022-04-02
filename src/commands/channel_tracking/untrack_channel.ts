import { createObjectCsvWriter } from "csv-writer";
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
        {
            name: "event_name",
            description: "the name of the training / event",
            type: "STRING",
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
        const data = channel.trackedMembers.map((x) => {
            return { username: x.user.username, time: x.channelTime / 1000 };
        });

        const csv = createObjectCsvWriter;
        const csvWriter = csv({
            path: `${__dirname}/../../../logs/voice_channel/${
                channel.name
            }-${interaction.options.getString("event_name")}.csv`,
            header: [
                { id: "username", title: "Username" },
                { id: "time", title: "Time" },
            ],
        });

        csvWriter.writeRecords(data);

        client.trackedChannels.delete(channel.id);

        interaction.user.send({
            content: `log for ${interaction.options.getString("event_name")}`,
            files: [
                `${__dirname}/../../../logs/voice_channel/${
                    channel.name
                }-${interaction.options.getString("event_name")}.csv`,
            ],
        });

        interaction.reply({
            ephemeral: true,
            content: `Channel ${channel} no longer tracked`,
        });
    },
});
