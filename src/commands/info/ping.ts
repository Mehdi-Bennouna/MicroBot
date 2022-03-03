import { Command } from "../../structures/Command";

export default new Command({
    name: "ping",
    description: "returns pong",
    run: async ({ interaction }) => {
        interaction.reply("Pong");
    },
});
