"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const __1 = require("..");
const Event_1 = require("../structures/Event");
const csv_writer_1 = require("csv-writer");
exports.default = new Event_1.Event("guildScheduledEventUpdate", async (oldEvent, newEvent) => {
    if (!__1.client.trackedEvents.get(oldEvent.id))
        return;
    const currentTime = new Date().getTime();
    const inChannel = (await newEvent.channel.fetch()).members;
    if (newEvent.status === "ACTIVE") {
        __1.client.activeTrackedEvents.set(newEvent.id, {
            event: newEvent,
            attendees: new discord_js_1.Collection(),
        });
        inChannel.forEach((user) => {
            __1.client.activeTrackedEvents.get(newEvent.id).attendees.set(user.id, {
                totalTime: 0,
                joinTime: currentTime,
                username: user.user.username,
            });
        });
        console.log("Active");
    }
    if (newEvent.status === "COMPLETED") {
        //hard counts time left
        const attendenceLog = __1.client.activeTrackedEvents.get(newEvent.id).attendees;
        inChannel.forEach((user) => {
            const temp = attendenceLog.get(user.id);
            temp.totalTime += currentTime - temp.joinTime;
            attendenceLog.set(user.id, temp);
        });
        attendenceLog.forEach((x) => console.log(`${x.username} : ${x.totalTime / 1000}s`));
        const finalData = attendenceLog.map((x) => {
            return { username: x.username, totalTime: x.totalTime };
        });
        __1.client.trackedEvents.delete(newEvent.id);
        const csv = (0, csv_writer_1.createObjectCsvWriter)({
            header: [
                { id: "username", title: "Username" },
                { id: "totalTime", title: "Time" },
            ],
            path: `event_logs/${newEvent.name}.csv`,
        });
        csv.writeRecords(finalData);
        (await __1.client.users.fetch("452896496728145921")).send({
            content: "test",
            files: [`${__dirname}/../../event_logs/${newEvent.name}.csv`],
        });
    }
    if (newEvent.status === "CANCELED") {
        //should remove it from the tracked list and do nothin
        __1.client.trackedEvents.delete(oldEvent.id);
        console.log("Canceled");
    }
});
