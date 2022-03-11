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
    commands: Collection<string, CommandType> = new Collection();
    trackedEvents: Collection<string, GuildScheduledEvent> = new Collection();
    activeTrackedEvents: Collection<
        string,
        {
            event: GuildScheduledEvent;
            attendees: Collection<
                string,
                { totalTime: number; joinTime: number; username: string }
            >;
        }
    > = new Collection();

    constructor() {
        super({
            intents: [
                "GUILD_SCHEDULED_EVENTS",
                "DIRECT_MESSAGES",
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILD_VOICE_STATES",
                "GUILD_MEMBERS",
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
            this.application?.commands.set(commands);
            console.log("Registering global commands");
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

        setInterval(() => {
            console.clear();
            client.activeTrackedEvents.forEach(async (event) => {
                const attendeesIds = (await event.event.channel.fetch()).members.map(
                    (attendee) => {
                        return attendee.id;
                    },
                );

                const eventAttendeesIds = event.attendees.map((attendee, id) => {
                    return id;
                });

                if (attendeesIds.length > 0) {
                    attendeesIds.forEach((attendee) => {
                        if (eventAttendeesIds.find((x) => x === attendee).length < 1) {
                            console.log("the tracked people do no match");
                        }
                    });
                }

                console.log(event.attendees);
            });
        }, 2000);
    }
}
