import { DiscmCommand, CommandOptionType } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Echoes what you say.',
	options: [
		{
			type: CommandOptionType.String,
			name: 'echo',
			description: 'Phrase to echo.',
			required: true
		}
	],
	run: ({ interaction }) => {
		const echo = interaction.options.getString('echo');

		interaction.reply({
			ephemeral: true,
			content: `${interaction.user}, this is the phrase I am echoing: \`${echo}\``
		});
	}
});
