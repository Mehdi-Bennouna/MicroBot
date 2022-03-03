import { Event } from "../structures/Event";

export default new Event("guildScheduledEventUpdate", () => {
    console.log("updated event");
});
