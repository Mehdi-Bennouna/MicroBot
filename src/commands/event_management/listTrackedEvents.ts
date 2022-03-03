import { Command } from "../../structures/Command";

export default new Command({
    name: "list_tracked_events",
    description: "lists every tracked event",
    run: async ({ client, interaction }) => {
        if (client.trackedEvents.size < 1) {
            return interaction.reply({
                ephemeral: true,
                content: "No event is currently tracked",
            });
        }

        const events = Array.from(client.trackedEvents.keys()).join("\n-");

        interaction.reply({ content: "-" + events, ephemeral: true });
    },
});
