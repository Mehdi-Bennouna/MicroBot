import { Event } from "../structures/Event";

export default new Event("ready", () => {
    console.log("logged in");
});
