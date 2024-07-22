import { DiscmEvent } from "discm.js";

export default new DiscmEvent({
    name: "ready",
    once: true,
    run(client){
        client.logger.info(`Successfully logged in as ${client.user?.tag}`);
    }
});