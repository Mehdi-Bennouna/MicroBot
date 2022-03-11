import { Command } from "../../structures/Command";

export default new Command({
    name: "track channel",
    description: "sets a channel to tracked",
    options: [
        //will add "is it training option" and "training name / choices lata"
        { name: "channel", description: "select a channel to track", type: "CHANNEL" },
    ],
    run: async ({ interaction }) => {
        interaction.reply({
            ephemeral: true,
            content: `Channel <#${interaction.options.getChannel(
                "channel",
            )}> is now tracked`,
        });
    },
});
