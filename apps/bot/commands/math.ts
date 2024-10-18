import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'text',
	description: 'Does math.',
	options: [
		{
			name: 'process',
			description: 'The process to use.',
			type: 'string',
			choices: [
				{
					name: 'add',
					value: '+'
				},
				{
					name: 'subtract',
					value: '-'
				},
				{
					name: 'multiply',
					value: '*'
				},
				{
					name: 'divide',
					value: '/'
				}
			]
		},
		{
			name: 'number1',
			description: 'The first number to use in the operation.',
			type: 'number'
		},
		{
			name: 'number2',
			description: 'The second number to use in the operation',
			type: 'number'
		}
	],
	run({ message, options }) {
		const process = options.getString('process');
		const number1 = options.getNumber('number1');
		const number2 = options.getNumber('number2');

		const equation = `${number1}${process}${number2}`;

		message.reply(
			`The result of your equation (\`${equation}\`) is \`${eval(
				equation
			)}\`.`
		);
	}
});
