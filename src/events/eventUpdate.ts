import {
    Collection,
    GuildMember,
    GuildMemberEditData,
    MessageAttachment,
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { createObjectCsvWriter } from "csv-writer";
import { OutgoingMessage } from "http";

export default new Event("guildScheduledEventUpdate", async (oldEvent, newEvent) => {
    if (!client.trackedEvents.get(oldEvent.id)) return;

    const currentTime = new Date().getTime();
    const inChannel = (await newEvent.channel.fetch()).members;

    if (newEvent.status === "ACTIVE") {
        client.activeTrackedEvents.set(newEvent.id, {
            event: newEvent,
            attendees: new Collection(),
        });

        inChannel.forEach((user) => {
            client.activeTrackedEvents.get(newEvent.id).attendees.set(user.id, {
                totalTime: 0,
                joinTime: currentTime,
                username: user.user.username,
            });
        });
        console.log("Active");
    }

    if (newEvent.status === "COMPLETED") {
        //hard counts time left
        const attendenceLog = client.activeTrackedEvents.get(newEvent.id).attendees;

        inChannel.forEach((user) => {
            const temp = attendenceLog.get(user.id);
            temp.totalTime += currentTime - temp.joinTime;
            attendenceLog.set(user.id, temp);
        });

        attendenceLog.forEach((x) =>
            console.log(`${x.username} : ${x.totalTime / 1000}s`),
        );

        const finalData = attendenceLog.map((x) => {
            return { username: x.username, totalTime: x.totalTime };
        });

        client.trackedEvents.delete(newEvent.id);

        const csv = createObjectCsvWriter({
            header: [
                { id: "username", title: "Username" },
                { id: "totalTime", title: "Time" },
            ],
            path: `event_logs/${newEvent.name}.csv`,
        });

        csv.writeRecords(finalData);

        (await client.users.fetch("452896496728145921")).send({
            content: "test",
            files: [`${__dirname}/../../event_logs/${newEvent.name}.csv`],
        });
    }

    if (newEvent.status === "CANCELED") {
        //should remove it from the tracked list and do nothin
        client.trackedEvents.delete(oldEvent.id);
        console.log("Canceled");
    }
});
