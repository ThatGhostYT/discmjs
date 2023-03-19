import { DiscmClient } from "discm.js";
import "dotenv/config";

const client = new DiscmClient({
    intents: ["Guilds"],
    dirs: {
        commands: `${__dirname}/commands`,
        events: `${__dirname}/events`
    }
});

client.login(process.env.DISCORD_BOT_TOKEN!);