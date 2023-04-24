import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Hello World!"',
	run: ({ interaction }) => {
		interaction.reply({
			ephemeral: true,
			content: 'Hello World!'
		});
	}
});
