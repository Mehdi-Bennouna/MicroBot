import { Collection } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("guildScheduledEventUpdate", (oldEvent, newEvent) => {
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
        console.log("Completed");
    }

    if (newEvent.status === "CANCELED") {
        client.trackedEvents.delete(oldEvent.id);
        //should remove it from the tracked list and do nothin
        console.log("Canceled");
    }
});
