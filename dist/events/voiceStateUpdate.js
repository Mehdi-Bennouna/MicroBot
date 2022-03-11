"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event("voiceStateUpdate", async (oldState, newState) => {
    //ignoring non event stuff
    if (oldState.channelId === newState.channelId) {
        return;
    }
    //joins or leaves non event channel
    if (!channelEvent(oldState.channelId) && !channelEvent(newState.channelId)) {
        return;
    }
    const currentTime = new Date().getTime();
    const userId = oldState.member.id;
    let joinTime;
    let totalTime;
    //leaves an event channel
    if (channelEvent(oldState.channelId)) {
        const oldChannelEvent = channelEvent(oldState.channelId).event;
        const oldChannelActiveEvent = __1.client.activeTrackedEvents.get(oldChannelEvent.id);
        console.log(`<Voice Update> ${oldState.member.user.username} Left an event channel`);
        joinTime = oldChannelActiveEvent.attendees.get(userId).joinTime;
        totalTime =
            oldChannelActiveEvent.attendees.get(userId).totalTime +
                (currentTime - joinTime);
        oldChannelActiveEvent.attendees.set(userId, {
            joinTime: joinTime,
            totalTime: totalTime,
            username: oldState.member.user.username,
        });
        console.log(`   time : ${totalTime / 1000}`);
    }
    //joins an event channel
    if (channelEvent(newState.channelId)) {
        const newChannelEvent = channelEvent(newState.channelId).event;
        const newChannelActiveEvent = __1.client.activeTrackedEvents.get(newChannelEvent.id);
        console.log(`<Voice Update> ${newState.member.user.username} Joined an event channel`);
        joinTime = currentTime;
        totalTime = newChannelActiveEvent.attendees?.get(userId)?.totalTime | 0;
        newChannelActiveEvent.attendees.set(userId, {
            joinTime: joinTime,
            totalTime: totalTime,
            username: newState.member.user.username,
        });
    }
});
const channelEvent = (id) => {
    return __1.client.activeTrackedEvents.find((event) => event.event.channelId === id);
};
