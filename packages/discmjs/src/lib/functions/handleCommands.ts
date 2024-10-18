import { DiscmClient } from '../classes/Client';
import { AnyCommand } from '../types/aliases';
import { Command } from '../types/interfaces';
import { CommandError } from '../classes/errors/CommandError';
import { walk } from 'walk';
import { APIApplicationCommandOption } from 'discord.js';
import { existsSync } from 'fs';
import { generateHelp } from './generateHelp';

/**
 * Parses all commands and gets them ready for deployment.
 * @param client The client parsing the commands.
 * @param commandsDir The directory where all commands are located.
 */
export const handleCommands = (client: DiscmClient, commandsDir: string) => {
	const walker = walk(commandsDir);
	const ignoreList: string[] = [];

	walker.on('file', async (pathname, { name: filename }, next) => {
		if (
			!(
				filename.endsWith('.js') ||
				(filename.endsWith('.ts') && !filename.endsWith('.d.ts'))
			)
		)
			return next();

		if (ignoreList.includes(`${pathname}/${filename}`)) return next();

		let subcommands = pathname
			.split(commandsDir)
			.slice(1)
			.map((dir) => (dir.startsWith('\\') ? dir.replace('\\', '') : dir));

		if (subcommands[0] === '' && subcommands.length === 1) subcommands = [];
		let overload = filename.includes('.overload');

		if (overload && subcommands.length > 0)
			throw new CommandError('Cannot overload a subcommand.');

		if (
			overload &&
			!existsSync(`${pathname}/${filename.replace(/\.overload/, '')}`)
		)
			throw new CommandError(
				'Cannot overload a command that doesn\'t exist. Try removing ".overload" from the file name.'
			);

		const command = (await import(`${pathname}/${filename}`))
			?.default as AnyCommand;

		if (command.type === 'text' && subcommands.length > 0)
			throw new CommandError('Cannot have a subcommand be of type text.');

		const name =
			command.name || overload
				? filename.replace(/\.overload\.(js|ts)/, '')
				: filename.replace(/\.(js|ts)/, '');
		if (overload) {
			const originalCommand = (
				await import(
					`${pathname}/${filename.replace(/\.overload/, '')}`
				)
			)?.default as AnyCommand;

			if (command.type === originalCommand.type)
				throw new CommandError(
					'Cannot overload a command with the same type.'
				);

			const textCommand = (
				command.type === 'slash' ? originalCommand : command
			) as Command<'text'>;
			const slashCommand = (
				command.type === 'slash' ? command : originalCommand
			) as Command<'slash'>;

			ignoreList.push(
				`${pathname}/${filename.replace(/\.overload/, '')}`
			);
			client.commands.set(name, {
				type: 'overload',
				name,
				description: originalCommand.description,
				options: textCommand.options || [],
				plugins: [],
				data: {
					name,
					description: slashCommand.description,
					options: slashCommand.options
				},
				delayedDeploy: slashCommand.delayDeploy ?? false,
				slashRun: (client, interaction) =>
					slashCommand.run({ client, interaction }),
				textRun: (client, message, options) =>
					textCommand.run({ client, message, options })
			});
		} else if (command.type === 'slash') {
			client.commands.set(
				subcommands.length > 0 ? subcommands[0]! : name,
				{
					type: 'slash',
					name,
					description: command.description,
					plugins: command.plugins ? command.plugins : [],
					delayedDeploy: command.delayDeploy ?? false,
					data: {
						name: subcommands.length > 0 ? subcommands[0]! : name,
						description: command.description,
						options:
							subcommands.length > 0
								? ([
										{
											type: 1,
											name,
											description: command.description,
											options: command.options || []
										}
								  ] as APIApplicationCommandOption[])
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

		if (client.autoGenerateHelp) {
			generateHelp(client);
		}
	});
};
