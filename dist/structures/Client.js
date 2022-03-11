"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedClient = void 0;
const discord_js_1 = require("discord.js");
const glob_1 = require("glob");
const util_1 = require("util");
const __1 = require("..");
const globPromise = (0, util_1.promisify)(glob_1.glob);
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    trackedEvents = new discord_js_1.Collection();
    activeTrackedEvents = new discord_js_1.Collection();
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
    async importFile(filePath) {
        return (await Promise.resolve().then(() => __importStar(require(filePath))))?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands);
            console.log(`Registering commands to ${guildId}`);
        }
        else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }
    async registerModules() {
        const slashCommands = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
        commandFiles.forEach(async (filePath) => {
            const command = await this.importFile(filePath);
            if (!command.name)
                return;
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
            const event = await this.importFile(filePath);
            this.on(event.event, event.run);
        });
        //holy this is ugly
        setInterval(() => {
            __1.client.activeTrackedEvents.forEach(async (event, eventId) => {
                const attendeesIds = (await event.event.channel.fetch()).members.map((attendee) => {
                    return attendee.id;
                });
                const eventAttendeesIds = event.attendees.map((attendee, id) => {
                    return id;
                });
                if (attendeesIds.length > 0) {
                    attendeesIds.forEach(async (attendee) => {
                        if (eventAttendeesIds.find((x) => x === attendee).length < 1) {
                            __1.client.activeTrackedEvents
                                .get(eventId)
                                .attendees.set(attendee, {
                                username: (await __1.client.users.fetch(attendee))
                                    .username,
                                joinTime: new Date().getTime(),
                                totalTime: 20000,
                            });
                            console.log("the tracked people do no match");
                        }
                    });
                }
                console.log(event.attendees);
            });
        }, 60000);
    }
}
exports.ExtendedClient = ExtendedClient;
