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
import { DeployError } from './errors/DeployError';

export class DiscmClient extends Client {
	private _commandsDir: string;
	private _eventsDir: string;
	public commands: Collection<string, ParsedCommand>;
	public events: Collection<string, AnyEvent>;
	public logger: Logger;
	public prefix: string;
	public global: boolean;

	constructor(options: ClientOptions & AdditionalClientOptions) {
		super(options);

		this._commandsDir = options.dirs.commands;
		this._eventsDir = options.dirs.events;
		this.prefix = options.prefix || '!';
		this.global = options.global || true;

		this.commands = new Collection();
		this.events = new Collection();

		this.logger = new Logger();

		handleCommands(this, this._commandsDir);
		handleEvents(this, this._eventsDir);
	}

	public override async login(token: string, guildId?: string | string[]) {
		if (guildId === undefined && this.global)
			throw new DeployError(
				'Cannot privately deploy with no provided guild ids.'
			);

		await super.login(token);
		await deploy(this, guildId);

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
				await rest.delete(
					Routes.applicationCommand(this.user.id, command.id)
				);
				break;
			}
		}
	}
}
