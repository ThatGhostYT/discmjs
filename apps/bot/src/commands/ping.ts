import { DiscmCommand } from "discm.js";

export default new DiscmCommand({
    type: "slash",
    description: "Replies with \"Pong!\"",
    run: ({ interaction }) => {
        interaction.reply({
            content: "Pong!",
            ephemeral: true
        });
    }
});