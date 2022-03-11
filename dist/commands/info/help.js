"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: "help",
    description: "returns every command",
    run: async ({ client, interaction }) => {
        console.log(client.commands.map((command) => command.name));
        interaction.reply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle("Help")
                    .setDescription("Available commands")
                    .addFields(client.commands.map((command) => {
                    return { name: command.name, value: command.description };
                })),
            ],
            content: "test",
        });
    },
});
