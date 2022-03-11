import {
    ApplicationCommandDataResolvable,
    Client,
    ClientEvents,
    Collection,
    GuildScheduledEvent,
} from "discord.js";
import { CommandType } from "../typings/Command";
import { glob } from "glob";
import { promisify } from "util";
import { RegisterCommandsOptions } from "../typings/Client";
import { Event } from "./Event";
import { client } from "..";

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    guildId = process.env.guildId;
    commands: Collection<string, CommandType> = new Collection();

    constructor() {
        super({
            intents: [
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_MESSAGES",
                "DIRECT_MESSAGES",
                "GUILD_VOICE_STATES",
                "GUILD_SCHEDULED_EVENTS",
                "GUILD_MESSAGE_REACTIONS",
            ],
        });
    }

    start() {
        this.registerModules();
        this.login(process.env.botToken);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async registerCommands({ commands, guildId }: RegisterCommandsOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        } else {
            console.log("Registering global commands");
            this.application?.commands.set(commands);
        }
    }

    async registerModules() {
        const slashCommands: ApplicationCommandDataResolvable[] = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);

        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath);
            if (!command.name) return;
            console.log(`<command> ${command.name} loaded`);
            this.commands.set(command.name, command);
            slashCommands.push(command);
        });

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId,
            });
        });

        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);

        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof ClientEvents> = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
    }
}
