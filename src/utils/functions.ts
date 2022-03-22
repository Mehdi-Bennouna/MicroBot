import csv from "csvtojson";
import { client } from "..";

export const csvToJSON = async (path: string) => {
    let data = await csv().fromFile(path);

    data = data.filter((x) => x.Trainings);
    data.forEach((x) => {
        x.Trainings = x.Trainings.split(" ");
    });
    return data;
};

export const isTrackedChannel = (channelId: string) => {
    return client.trackedChannels.find((x) => x.id === channelId);
};