import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Pong!"',
	run({ client, interaction }) {
		interaction.reply({
			content: `Pong! Websocket heatbeat: \`${client.ws.ping}ms\``,
			ephemeral: true
		});
	}
});
