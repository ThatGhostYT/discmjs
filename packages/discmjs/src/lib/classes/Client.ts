import { Client, ClientOptions, Collection } from 'discord.js';
import { handleCommands } from '../functions/handleCommands';
import { handleEvents } from '../functions/handleEvents';
import { deploy } from '../functions/deploy';
import { AdditionalClientOptions } from '../types/interfaces';
import { ParsedCommand, AnyEvent } from '../types/aliases';
import { DiscmPlugin } from './DiscmPlugin';
import { Logger } from './Logger';

export class DiscmClient<T extends string = string> extends Client {
	private _commandsDir: string;
	private _eventsDir: string;
	private _middleware: DiscmPlugin<'middleware'>[];
	public commands: Collection<string, ParsedCommand>;
	public events: Collection<string, AnyEvent>;
	public logger: Logger;
	public prefix: string;
	public middleware: Record<T, {}> | {};

	constructor(options: ClientOptions & AdditionalClientOptions) {
		super(options);

		this._commandsDir = options.dirs.commands;
		this._eventsDir = options.dirs.events;
		this.prefix = options.prefix || '!';

		this.commands = new Collection();
		this.events = new Collection();

		this._middleware = [];
		if (options.middleware!.length > 0) {
			for (const middleware of options.middleware!) {
				this._middleware.push({ type: 'middleware', ...middleware });
			}
		}

		this.logger = new Logger();
		this.middleware = {};

		handleCommands(this, this._commandsDir);
		handleEvents(this, this._eventsDir);

		this._runMiddleware();
	}

	private _runMiddleware() {
		for (const middleware of this._middleware) {
			const props = middleware.run({ client: this });

			this.middleware[middleware.name] = props;
		}
	}

	public override async login(token: string) {
		await super.login(token);
		await deploy(this);

		return token;
	}
}
