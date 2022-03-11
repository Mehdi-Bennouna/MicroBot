"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: "list_tracked_events",
    description: "lists every tracked event",
    run: async ({ client, interaction }) => {
        if (client.trackedEvents.size < 1) {
            return interaction.reply({
                ephemeral: true,
                content: "No event is currently tracked",
            });
        }
        const eventNames = client.trackedEvents.map((event) => {
            return event.name;
        });
        const events = Array.from(eventNames).join("\n-");
        interaction.reply({ content: "-" + events, ephemeral: true });
    },
});
