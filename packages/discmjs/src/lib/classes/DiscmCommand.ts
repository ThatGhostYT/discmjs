import {
	APIApplicationCommandOption,
	Awaitable,
	ChatInputCommandInteraction,
	Message
} from 'discord.js';
import { Command, CommandTextOptionResults, Plugin } from '../types/interfaces';
import { AnyCommandTextOption } from '../types/aliases';
import { DiscmClient } from './Client';

/**
 * A discm command.
 * Can be either text or slash (/).
 */
export class DiscmCommand<T extends 'slash' | 'text'> implements Command<T> {
	/**
	 * The name of the command.
	 */
	public name: string;

	/**
	 * The description of the command.
	 */
	public description: string;

	/**
	 * Whether the command is text or slash (/).
	 */
	public type: T;

	/**
	 * The options the command accepts.
	 */
	public options?: T extends 'slash'
		? APIApplicationCommandOption[]
		: AnyCommandTextOption[];

	/**
	 * Plugins the command uses.
	 */
	public plugins?: Plugin<T>[];

	/**
	 * Whether to delay the deployment of this command.
	 */
	public delayedDeploy?: boolean;

	/**
	 * The code to execute once the command is called.
	 */
	public run: T extends 'slash'
		? (args: {
				client: DiscmClient;
				interaction: ChatInputCommandInteraction;
		  }) => Awaitable<void>
		: (args: {
				client: DiscmClient;
				message: Message;
				options: CommandTextOptionResults;
		  }) => Awaitable<void>;

	constructor(command: Command<T>) {
		this.name = command.name || '';
		this.description = command.description;
		this.type = command.type;
		this.run = command.run;
		this.options = command.options as [];
		this.plugins = command.plugins || [];
		this.delayedDeploy = command.delayDeploy ?? false;
	}
}
