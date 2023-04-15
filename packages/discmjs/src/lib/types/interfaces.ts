import {
	Awaitable,
	ChatInputCommandInteraction,
	ClientEvents,
	Message,
	RESTPostAPIApplicationCommandsJSONBody,
	APIApplicationCommandOption,
	Client
} from 'discord.js';
import { DiscmClient } from '../classes/Client';
import { DiscmPlugin } from '../classes/DiscmPlugin';
import { AnyCommand, Immutable } from './aliases';

export interface AdditionalClientOptions {
	/** The directories to read from. */
	dirs: {
		/** The directory to read commands from. */
		commands: string;
		/** The directory to read events from. */
		events: string;
	};
	/** Prefix for text commands. Defaults to `!` */
	prefix?: string;
	/** A list of middleware plugins for the client to use. */
	middleware?: Omit<DiscmPlugin<'middleware'>, 'type'>[];
}

export interface Command<T extends 'slash' | 'text'> {
	name?: string;
	description: string;
	type: T;
	options?: T extends 'slash' ? APIApplicationCommandOption[] : never;
	plugins?: Plugin<T>[];
	/** Action to perform when the command is ran. */
	run: T extends 'slash'
		? (args: {
				client: DiscmClient;
				interaction: ChatInputCommandInteraction;
		  }) => Awaitable<void>
		: (args: {
				client: DiscmClient;
				message: Message;
				args: string[];
		  }) => Awaitable<void>;
}

export interface DiscordEvent<T extends keyof ClientEvents> {
	name: T;
	/** If true, the event will be called with {@link Client.once} instead of {@link Client.on}.*/
	once?: boolean;
	/** Action to perform when the event is called. */
	run: (client: DiscmClient, ...args: ClientEvents[T]) => Awaitable<void>;
}

export interface ParsedTextCommand {
	type: 'text';
	name: string;
	description?: string;
	plugins: Plugin<'text'>[];
	run: (
		client: DiscmClient,
		message: Message,
		args: string[]
	) => Awaitable<void>;
}

export interface ParsedSlashCommand {
	type: 'slash';
	name: string;
	description: string;
	data: RESTPostAPIApplicationCommandsJSONBody;
	plugins: Plugin<'slash'>[];
	run: (
		client: DiscmClient,
		interaction: ChatInputCommandInteraction
	) => Awaitable<void>;
}

export interface Plugin<T extends 'text' | 'slash' | 'middleware'> {
	type: T;
	name: string;
	run: T extends 'message'
		? (args: {
				command: AnyCommand;
				client: DiscmClient;
				message: Message;
		  }) => 'stop' | 'continue'
		: T extends 'slash'
		? (args: {
				command: AnyCommand;
				client: DiscmClient;
				interaction: ChatInputCommandInteraction;
		  }) => 'stop' | 'continue'
		: (args: { client: Immutable<DiscmClient> }) => Record<string, unknown>;
}
