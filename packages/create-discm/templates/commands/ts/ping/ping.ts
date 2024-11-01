import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'text',
	description: 'Replies with "Pong!"',
	run({ client, message }) {
		message.reply(`Pong! Websocket heatbeat: \`${client.ws.ping}ms\``);
	}
});
