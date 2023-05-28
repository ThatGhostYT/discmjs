import {
	Client,
	ClientOptions,
	Collection,
	REST,
	Routes,
	ApplicationCommand
} from 'discord.js';
import { handleCommands } from '../functions/handleCommands';
import { handleEvents } from '../functions/handleEvents';
import { deploy } from '../functions/deploy';
import { AdditionalClientOptions } from '../types/interfaces';
import { ParsedCommand, AnyEvent } from '../types/aliases';
import { Logger } from './Logger';
import { CommandError } from './errors/CommandError';

export class DiscmClient extends Client {
	private _commandsDir: string;
	private _eventsDir: string;
	public commands: Collection<string, ParsedCommand>;
	public events: Collection<string, AnyEvent>;
	public logger: Logger;
	public prefix: string;

	constructor(options: ClientOptions & AdditionalClientOptions) {
		super(options);

		this._commandsDir = options.dirs.commands;
		this._eventsDir = options.dirs.events;
		this.prefix = options.prefix || '!';

		this.commands = new Collection();
		this.events = new Collection();

		this.logger = new Logger();

		handleCommands(this, this._commandsDir);
		handleEvents(this, this._eventsDir);
	}

	public override async login(token: string) {
		await super.login(token);
		await deploy(this);

		return token;
	}

	public async deleteSlashCommand(name: string) {
		if (!this.isReady())
			throw new CommandError(
				'Cannot delete commands before the bot is online.'
			);
		const rest = new REST().setToken(this.token);

		const commands = (await rest.get(
			Routes.applicationCommands(this.user.id)
		)) as ApplicationCommand[];

		for (const command of commands) {
			if (command.name === name) {
				rest.delete(
					Routes.applicationCommand(this.user.id, command.id)
				);
				break;
			}
		}
	}
}
