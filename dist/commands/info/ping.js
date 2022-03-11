"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: "ping",
    description: "returns pong",
    run: async ({ interaction }) => {
        interaction.reply("Pong");
    },
});
