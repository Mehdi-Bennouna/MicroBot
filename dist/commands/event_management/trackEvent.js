"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.Command({
    name: "track_event",
    description: "select an event to track",
    run: async ({ client, interaction }) => {
        const events = interaction.guild.scheduledEvents.cache;
        if (events.size < 1) {
            return interaction.reply({ ephemeral: true, content: "No events to track" });
        }
        const menu = new discord_js_1.MessageSelectMenu()
            .setCustomId("track_event")
            .setPlaceholder("Select an event to track");
        events.forEach((event) => {
            menu.addOptions({
                label: event.name,
                value: event.id,
            });
        });
        const row = new discord_js_1.MessageActionRow().addComponents(menu);
        interaction.reply({ ephemeral: true, components: [row] });
        const msg = (await interaction.fetchReply());
        const collector = new discord_js_1.InteractionCollector(client, {
            message: msg,
            max: 1,
            time: 10000,
        });
        collector.on("collect", (collected) => {
            if (collected.values[0]) {
                client.trackedEvents.set(collected.values[0], events.filter((event) => event.id === collected.values[0]).first());
                menu.setDisabled(true);
                interaction.editReply({ components: [row] });
                collected
                    .reply({
                    content: `Event "${client.trackedEvents.get(collected.values[0]).name}" is now tracked`,
                    ephemeral: true,
                })
                    .then(() => collector.stop);
            }
        });
        collector.on("end", () => {
            menu.setDisabled(true);
            interaction.editReply({ components: [row] });
        });
    },
});
