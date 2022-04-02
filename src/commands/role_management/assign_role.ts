import { Role } from "discord.js";
import https from "https";
import { Command } from "../../structures/Command";

export default new Command({
    name: "assign_role",
    description: "feed it a file and ll asign a role",
    userPermissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "role",
            description: "the role ",
            type: "ROLE",
            required: true,
        },
        {
            name: "file",
            description: "link to the file",
            type: "STRING",
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const guildMembers = await interaction.guild.members.fetch();

        try {
            const dataString = (await getData(
                interaction.options.getString("file"),
            )) as string;
            const memberTags = dataString.split("\n").slice(0, -1);

            guildMembers
                .filter((member) => memberTags.includes(member.user.tag))
                .forEach((member) => {
                    member.roles.add(interaction.options.getRole("role") as Role);
                });

            interaction.reply({ ephemeral: true, content: "added the roles" });
        } catch (error) {
            console.log(error);
            interaction.reply({
                ephemeral: true,
                content: "somethin happened and its not gud",
            });
        }

    },
});

const getData = (url: string) => {
    return new Promise((resolve, reject) => {
        https
            .get(url, (resp) => {
                let data = "";

                resp.on("data", (chunk) => {
                    data += chunk;
                });

                resp.on("end", () => {
                    resolve(data);
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
};