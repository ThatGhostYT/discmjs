import { DiscmClient } from '../classes/Client';
import { AnyCommand } from '../types/aliases';
import { CommandError } from '../classes/errors/CommandError';
import { walk } from 'walk';
import { APIApplicationCommandOption } from 'discord.js';

export const handleCommands = (client: DiscmClient, commandsDir: string) => {
	const walker = walk(commandsDir);

	walker.on('file', async (pathname, { name: filename }, next) => {
		if (
			!(
				filename.endsWith('.js') ||
				(filename.endsWith('.ts') && !filename.endsWith('.d.ts'))
			)
		)
			return next();

		let subcommands = pathname
			.split(commandsDir)
			.slice(1)
			.map((dir) => (dir.startsWith('\\') ? dir.replace('\\', '') : dir));

		if (subcommands[0] === '' && subcommands.length === 1) subcommands = [];

		const command = (await import(`${pathname}/${filename}`))
			?.default as AnyCommand;

		if (command.type === 'text' && subcommands.length > 0)
			throw new CommandError('Cannot have a subcommand be of type text.');

		const name = command.name || filename.replace(/\.(js|ts)/, '');
		if (command.type === 'slash') {
			client.commands.set(
				subcommands.length > 0 ? subcommands[0]! : name,
				{
					type: 'slash',
					name,
					description: command.description,
					plugins: command.plugins ? command.plugins : [],
					data: {
						name: subcommands.length > 0 ? subcommands[0]! : name,
						description: command.description,
						options:
							subcommands.length > 0
								? [
										{
											type: 1,
											name,
											description: command.description,
											options: command.options || []
										}
								  ] as APIApplicationCommandOption[]
								: command.options || []
					},
					run: (client, interaction) =>
						command.run({ client, interaction })
				}
			);
		} else if (command.type === 'text') {
			client.commands.set(name, {
				type: 'text',
				name,
				description: command.description,
				plugins: command.plugins ? command.plugins : [],
				options: command.options ? command.options : [],
				run: (client, message, options) =>
					command.run({ client, message, options })
			});
		}

		next();
	});

	walker.on('end', () => {
		client.logger.success('Successfully compiled all commands!');
	});
};
