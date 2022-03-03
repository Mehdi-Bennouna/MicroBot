import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "help",
    description: "returns every command",
    run: async ({ client, interaction }) => {
        console.log(client.commands.map((command) => command.name));
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Help")
                    .setDescription("Available commands")
                    .addFields(
                        client.commands.map((command) => {
                            return { name: command.name, value: command.description };
                        }),
                    ),
            ],
            content: "test",
        });
    },
});
