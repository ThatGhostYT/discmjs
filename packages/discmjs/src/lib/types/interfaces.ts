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
	/**
	 * Whether to deploy the slash commands globally or to a specific guild.
	 * If false, a guild id or an array of guild ids will have to be provided to the login function.
	 */
	global?: boolean;
}

export interface Command<T extends 'slash' | 'text'> {
	/** @deprecated Use file names instead. */
	name?: string;
	description: string;
	type: T;
	options?: T extends 'slash'
		? APIApplicationCommandOption[]
		: CommandTextOption[];
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
				options: CommandTextOptionValue[];
		  }) => Awaitable<void>;
}

export interface CommandTextOption {
	name: string;
	description: string;
	type: 'string' | 'number' | 'boolean';
}

export interface CommandTextOptionValue {
	valid: boolean;
	value: string | number | boolean;
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
	options: CommandTextOption[];
	run: (
		client: DiscmClient,
		message: Message,
		options: CommandTextOptionValue[]
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

export interface Plugin<T extends 'text' | 'slash'> {
	type: T;
	name: string;
	run: T extends 'text'
		? (args: {
				command: Omit<ParsedTextCommand, 'run'>;
				client: DiscmClient;
				message: Message;
		  }) => 'stop' | 'continue'
		: (args: {
				command: Omit<ParsedSlashCommand, 'run'>;
				client: DiscmClient;
				interaction: ChatInputCommandInteraction;
		  }) => 'stop' | 'continue';
}
