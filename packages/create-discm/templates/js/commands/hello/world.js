const { DiscmCommand } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Hello World!"',
	run({ interaction }) {
		interaction.reply({
			content: 'Hello World!',
			ephemeral: true
		});
	}
});
