import { DiscmCommand } from "discm.js";

export default new DiscmCommand({
    type: "text",
    description: "Replied with \"Pong!\"",
    run: ({ message }) => {
        message.reply("Pong!");
    }
});