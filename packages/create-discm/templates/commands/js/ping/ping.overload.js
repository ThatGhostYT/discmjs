const { DiscmCommand } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Pong!"',
	run({ client, interaction }) {
		interaction.reply({
			content: `Pong! Websocket heartbeat: \`${client.ws.ping}ms\``,
			ephemeral: true
		});
	}
});
