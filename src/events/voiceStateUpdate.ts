import { client } from "..";
import { Event } from "../structures/Event";


export default new Event("voiceStateUpdate", async (oldState, newState) => {
    //ignoring non event stuff
    if (oldState.channelId === newState.channelId) {
        return;
    }

    if (!channelEvent(oldState.channelId) && !channelEvent(newState.channelId)) {
        return;
    }

    const currentTime = new Date().getTime();
    const userId = oldState.member.id;

    let joinTime: number;
    let totalTime: number;

    if (channelEvent(oldState.channelId)) {
        const oldChannelEvent = channelEvent(oldState.channelId).event;
        const oldChannelActiveEvent = client.activeTrackedEvents.get(oldChannelEvent.id);

        console.log("<Voice Update> Left an event channel");

        joinTime = oldChannelActiveEvent.attendees.get(userId).joinTime;

        totalTime =
            oldChannelActiveEvent.attendees.get(userId).totalTime +
            (currentTime - joinTime);

        oldChannelActiveEvent.attendees.set(userId, {
            joinTime: joinTime,
            totalTime: totalTime,
            username: oldState.member.user.username,
        });

        console.log(`total : ${totalTime / 1000}`);
    }

    if (channelEvent(newState.channelId)) {
        const newChannelEvent = channelEvent(newState.channelId).event;
        const newChannelActiveEvent = client.activeTrackedEvents.get(newChannelEvent.id);

        console.log("<Voice Update> Joined an event channel");

        joinTime = currentTime;

        totalTime = newChannelActiveEvent.attendees?.get(userId)?.totalTime | 0;

        newChannelActiveEvent.attendees.set(userId, {
            joinTime: joinTime,
            totalTime: totalTime,
            username: newState.member.user.username,
        });
    }
});

const channelEvent = (id: string) => {
    return client.activeTrackedEvents.find((event) => event.event.channelId === id);
};