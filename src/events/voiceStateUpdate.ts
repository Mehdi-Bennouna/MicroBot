import { client } from "..";
import { Event } from "../structures/Event";

export default new Event("voiceStateUpdate", async (oldState, newState) => {
    //on mute / unmute
    if (oldState.channelId === newState.channelId) {
        console.log("nothin changed");
        return;
    }
    const channelEvent = isTrackedChannel(newState.channel.id);
    const userId = newState.member.id;
    const time = new Date().getTime();
    const pastTime = channelEvent.attendees.get(userId).lastTime | time;
    const pastTotal = channelEvent.attendees.get(userId).totalTime | 0;

    //leaveing tracked channel
    if (isTrackedChannel(oldState.channel?.id)) {
        channelEvent.attendees.set(userId, {
            lastTime: time,
            totalTime: pastTotal + time - pastTime,
        });
        console.log("left tarcked channel");
    }

    //joining tracked channel
    if (isTrackedChannel(newState.channel?.id)) {
        channelEvent.attendees.set(userId, { totalTime: pastTotal, lastTime: time });

        client.activeTrackedEvents.set(channelEvent.event.id, channelEvent);

        console.log(`${newState.member.user.username} Joined event channel`);
        console.log(client.activeTrackedEvents.get(channelEvent.event.id).attendees);
    }
});

const isTrackedChannel = (id: string) => {
    return client.activeTrackedEvents.find((event) => event.event.channel.id === id);
};
