const { DiscmCommand } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'text',
	description: 'Replies with "Pong!"',
	run({ message }) {
		message.reply('Pong!');
	}
});
