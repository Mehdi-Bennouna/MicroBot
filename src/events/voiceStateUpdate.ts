import { client } from "..";
import { Event } from "../structures/Event";
import { isTrackedChannel } from "../utils/functions";
import { ExtendedMember } from "../typings/Member";

export default new Event("voiceStateUpdate", async (oldState, newState) => {
    //ignoring mute unmute stuff
    if (oldState.channelId === newState.channelId) {
        return;
    }

    const currentTime = new Date().getTime();

    //joining tracked channel
    if (isTrackedChannel(newState.channelId)) {
        console.log(
            `<voice-update> ${newState.member.user.username} joined '${newState.channel.name}'`,
        );
        const channel = client.trackedChannels.get(newState.channelId);
        const tempMember = newState.member as ExtendedMember;

        tempMember.channelTime =
            channel.trackedMembers.get(newState.member.id)?.channelTime | 0;
        tempMember.channelJoinTime = currentTime;

        channel.trackedMembers.set(newState.member.id, tempMember);
    }

    //leaveing tracked channel
    if (isTrackedChannel(oldState.channelId)) {
        console.log(
            `<voice-update> ${oldState.member.user.username} left '${oldState.channel.name}'`,
        );

        const channel = client.trackedChannels.get(oldState.channelId);
        const tempMember = oldState.member as ExtendedMember;

        tempMember.channelJoinTime = channel.trackedMembers.get(
            oldState.member.id,
        ).channelJoinTime;

        tempMember.channelTime =
            channel.trackedMembers.get(oldState.member.id).channelTime +
            (currentTime - tempMember.channelJoinTime);

        channel.trackedMembers.set(newState.member.id, tempMember);
    }
});
