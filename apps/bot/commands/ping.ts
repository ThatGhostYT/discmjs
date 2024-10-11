import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'text',
	description: 'Replys with "Pong!"',
	run: ({ client, message }) => {
		message.reply(`Pong! Websocket heartbeat: **${client.ws.ping}**ms.`);
	}
});
