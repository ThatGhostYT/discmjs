import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'text',
	description: 'Says hello to someone with the provided name.',
	options: [
		{
			name: 'name',
			description: 'The name of the person to say hello to.',
			type: 'string'
		}
	],
	run: ({ message, options }) => {
		message.reply(
			`Hello ${options[0]?.valid ? options[0]?.value : message.author}!`
		);
	}
});
