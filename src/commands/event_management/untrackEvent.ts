import {
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "untrack_event",
    description: "remove event from tracked list",
    run: async ({ client, interaction }) => {
        const trackedEvents = client.trackedEvents;

        if (trackedEvents.size < 1) {
            return interaction.reply({
                ephemeral: true,
                content: "No event tracked for now",
            });
        }

        const menu = new MessageSelectMenu()
            .setCustomId("untrack_event")
            .setPlaceholder("Select an event");

        trackedEvents.forEach((event) => {
            menu.addOptions({
                label: event.name,
                value: event.id,
            });
        });

        const row = new MessageActionRow().addComponents(menu);
        interaction.reply({ ephemeral: true, components: [row] });

        const msg = (await interaction.fetchReply()) as Message;

        const collector = new InteractionCollector(client, {
            message: msg,
            max: 1,
            time: 10000,
        });

        collector.on("collect", (collected: SelectMenuInteraction) => {
            if (collected.values[0]) {
                collected
                    .reply({
                        content: `Event : "${
                            client.trackedEvents.get(collected.values[0]).name
                        }" is not tracked anymore`,
                        ephemeral: true,
                    })
                    .then(() => collector.stop);
                client.trackedEvents.delete(collected.values[0]);
            }

            menu.setDisabled(true);
            interaction.editReply({ components: [row] });
        });

        collector.on("ent", () => {
            menu.setDisabled(true);
            interaction.editReply({ components: [row] });
        });
    },
});
