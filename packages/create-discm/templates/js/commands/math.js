const { DiscmCommand, Plugins } = require('discm.js');

module.exports = new DiscmCommand({
	type: 'text',
	description: 'Does math',
	plugins: [
		Plugins.EveryOptionValid({
			content: 'Not all options are valid.'
		})
	],
	options: [
		{
			name: 'process',
			description: 'The process to use.',
			type: 'string',
			choices: ['add', 'multiply', 'subtract', 'divide']
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
		const operations = {
			add: '+',
			subtract: '-',
			multiply: '*',
			divide: '/'
		};

		const equation = `${options['number1'].value}${
			operations[options['process'].value]
		}${options['number2'].value}`;

		message.reply(
			`The result of your equation (\`${equation}\`) is \`${eval(
				equation
			)}\``
		);
	}
});
