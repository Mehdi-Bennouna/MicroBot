import { Command } from "../../structures/Command";
import { csvToJSON } from "../../utils/functions";

export default new Command({
    name: "ping",
    description: "returns pong",
    run: async ({ interaction }) => {
        interaction.followUp("Pong");
    },
});
