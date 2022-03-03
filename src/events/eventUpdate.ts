import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("guildScheduledEventUpdate", (oldEvent, event) => {
    if (!client.trackedEvents.get(oldEvent.name)) return;

    if (event.status === "ACTIVE") {
        //add it to the active trackedEvents list
        console.log("Active");
    }

    if (event.status === "COMPLETED") {
        //should return the csv here
        console.log("Completed");
    }

    if (event.status === "CANCELED") {
        //should remove it from the tracked list and do nothin
        console.log("Canceled");
    }
});
