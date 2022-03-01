import csv from "csvtojson";

export const csvToJSON = async (path: string) => {
    let data = await csv().fromFile(path);

    data = data.filter((x) => x.Trainings);
    data.forEach((x) => {
        x.Trainings = x.Trainings.split(" ");
    });
    return data;
};
