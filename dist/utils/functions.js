"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJSON = void 0;
const tslib_1 = require("tslib");
const csvtojson_1 = tslib_1.__importDefault(require("csvtojson"));
const csvToJSON = async (path) => {
    let data = await (0, csvtojson_1.default)().fromFile(path);
    data = data.filter((x) => x.Trainings);
    data.forEach((x) => {
        x.Trainings = x.Trainings.split(" ");
    });
    return data;
};
exports.csvToJSON = csvToJSON;
