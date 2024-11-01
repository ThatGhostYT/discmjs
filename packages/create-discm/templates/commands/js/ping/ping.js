const { DiscmCommand } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'text',
	description: 'Replies with "Pong!"',
	run({ client, message }) {
		message.reply(`Pong! Websocket heartbeat: \`${client.ws.ping}ms\``);
	}
});
