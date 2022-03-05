import { Collection, GuildMember, GuildMemberEditData } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("guildScheduledEventUpdate", async (oldEvent, newEvent) => {
    if (!client.trackedEvents.get(oldEvent.id)) return;

    if (newEvent.status === "ACTIVE") {
        client.activeTrackedEvents.set(newEvent.id, {
            event: newEvent,
            attendees: new Collection(),
        });
        console.log("Active");
    }

    if (newEvent.status === "COMPLETED") {
        //should return the csv here
        const attendees = client.activeTrackedEvents.get(newEvent.id).attendees;
        const final = attendees.map((id) => {
            return { username: id.username, Time: id.totalTime };
        });
        console.log(final);
    }

    if (newEvent.status === "CANCELED") {
        //should remove it from the tracked list and do nothin
        client.trackedEvents.delete(oldEvent.id);
        console.log("Canceled");
    }
});
