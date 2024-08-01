const { DiscmCommand } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Pong!"',
	run({ interaction }) {
		interaction.reply({
			content: 'Pong!',
			ephemeral: true
		});
	}
});
