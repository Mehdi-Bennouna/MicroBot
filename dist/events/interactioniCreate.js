"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../structures/Event");
const __1 = require("..");
exports.default = new Event_1.Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = __1.client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("You have used an unexistant command");
        command.run({
            args: interaction.options,
            client: __1.client,
            interaction: interaction,
        });
    }
});
