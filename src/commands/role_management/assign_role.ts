import { Role } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "asign_role",
    description: "feed it a file and ll asign a role",
    userPermissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "role",
            description: "the role ",
            type: "ROLE",
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const guildMembers = await interaction.guild.members.fetch();
        const memberIds = ["338784722647908354", "624775224637784064"];

        guildMembers
            .filter((member) => memberIds.includes(member.id))
            .forEach((member) => {
                member.roles.add(interaction.options.getRole("role") as Role);
            });

        interaction.reply({ ephemeral: true, content: "added the roles" });
    },
});
