import {
	REST,
	Routes,
	Collection,
	RESTPostAPIApplicationCommandsJSONBody as CommandData
} from 'discord.js';
import { DiscmClient } from '../classes/Client';
import { ParsedSlashCommand } from '../types/interfaces';
import { DeployError } from '../classes/errors/DeployError';

export const deploy = async (client: DiscmClient) => {
	const slashOnly = client.commands.filter(
		(c) => c.type === 'slash'
	) as Collection<string, ParsedSlashCommand>;

	const commandRawData: CommandData[] = [];
	for (const [, command] of slashOnly) {
		const subcommands = command.data.options?.filter(
			(option) => option.type === 1
		);
		client.logger.info(
			`Command ${command.data.name} is getting deployed${
				subcommands?.length! > 0
					? ` (with ${subcommands?.length} subcommands)`
					: ''
			}!`
		);
		commandRawData.push(command.data);
	}

	try {
		await new REST({ version: '10' })
			.setToken(client.token!)
			.put(Routes.applicationCommands(client.application?.id!), {
				body: commandRawData
			});
	} catch (err) {
		throw new DeployError(err);
	}
};
