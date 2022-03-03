import { Event } from "../structures/Event";
import { client } from "..";
import { CommandInteractionOptionResolver } from "discord.js";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.followUp("You have used an unexistant command");

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction,
        });
    }
});
