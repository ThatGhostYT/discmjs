import { DiscmCommand, CommandOptionType } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Does math.',
	options: [
		{
			name: 'process',
			description: 'The operation to use when doing math.',
			type: CommandOptionType.String,
			choices: [
				{ name: 'add', value: '+' },
				{ name: 'subtract', value: '-' },
				{ name: 'multiply', value: '*' },
				{ name: 'divide', value: '/' }
			],
			required: true
		},
		{
			name: 'number1',
			description: 'The first number of the equation.',
			type: CommandOptionType.Integer,
			required: true
		},
		{
			name: 'number2',
			description: 'The second number of the equation.',
			type: CommandOptionType.Integer,
			required: true
		}
	],
	run({ interaction }) {
		const process = interaction.options.getString('process');
		const number1 = interaction.options.getInteger('number1');
		const number2 = interaction.options.getInteger('number2');

		const equation = `${number1}${process}${number2}`;

		interaction.reply({
			content: `The result of your equation (\`${equation}\`) is \`${eval(
				equation
			)}\`.`,
			ephemeral: true
		});
	}
});
