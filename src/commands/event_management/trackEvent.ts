import {
    InteractionCollector,
    Message,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "track_event",
    description: "select an event to track",
    run: async ({ client, interaction }) => {
        const events = await interaction.guild.scheduledEvents.fetch();

        const menu = new MessageSelectMenu()
            .setCustomId("track_event")
            .setPlaceholder("Select an event to track");

        events.forEach((event) => {
            menu.addOptions({
                label: event.name,
                value: event.name,
            });
        });

        const row = new MessageActionRow().addComponents(menu);
        interaction.reply({ ephemeral: true, components: [row] });

        const msg = (await interaction.fetchReply()) as Message;
        const collector = new InteractionCollector(client, msg);

        collector.on("collect", (collected: SelectMenuInteraction) => {
            client.trackedEvents.set(
                collected.values[0],
                events.filter((event) => event.name === collected.values[0]).first(),
            );

            menu.setDisabled(true);
            interaction.editReply({ components: [row] });

            collected.reply({
                content: `Event "${collected.values[0]}" is now tracked`,
                ephemeral: true,
            });
        });
    },
});
