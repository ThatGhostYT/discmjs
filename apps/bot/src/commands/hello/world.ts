import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Replies with "Hello World!"',
	run: ({ client, interaction }) => {
		interaction.reply({
			ephemeral: true,
			...client.middleware.response
		});
	}
});
