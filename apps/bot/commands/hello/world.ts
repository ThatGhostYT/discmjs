import { DiscmCommand } from "discm.js";

export default new DiscmCommand({
    type: "slash",
    description: "Says \"Hello World!\"",
    run: ({ interaction }) => {
        interaction.reply({
            content: "Hello World!",
            ephemeral: true
        });
    }
})