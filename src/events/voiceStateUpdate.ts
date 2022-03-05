import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("voiceStateUpdate", async (oldState, newState) => {});

const isTrackedChannel = (id: string) => {
    return client.activeTrackedEvents.find((event) => event.event.channel.id === id);
};
