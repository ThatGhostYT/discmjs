import {
	REST,
	Routes,
	Collection,
	RESTPostAPIApplicationCommandsJSONBody as CommandData
} from 'discord.js';
import { DiscmClient } from '../classes/Client';
import { ParsedSlashCommand } from '../types/interfaces';
import { DeployError } from '../classes/errors/DeployError';

export const deploy = async (
	client: DiscmClient,
	guildId?: string | string[]
) => {
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
		if (client.global) {
			await new REST()
				.setToken(client.token!)
				.put(Routes.applicationCommands(client.application?.id!), {
					body: commandRawData
				});
		} else {
			client.logger.custom(["Deploying commands privately!"],"deploy","blue");
			if (Array.isArray(guildId)) {
				for (const id of guildId) {
					await new REST()
						.setToken(client.token!)
						.put(
							Routes.applicationGuildCommands(
								client.application?.id!,
								id
							),
							{
								body: commandRawData
							}
						);
				}
			} else
				await new REST()
					.setToken(client.token!)
					.put(
						Routes.applicationGuildCommands(
							client.application?.id!,
							guildId!
						),
						{
							body: commandRawData
						}
					);
		}
	} catch (err) {
		throw new DeployError(err);
	}
};
