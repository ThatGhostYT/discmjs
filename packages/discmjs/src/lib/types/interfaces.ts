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
}

export interface Command<T extends 'slash' | 'text'> {
	name?: string;
	description: string;
	type: T;
	options?: T extends 'slash' ? APIApplicationCommandOption[] : never;
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
	run: (
		client: DiscmClient,
		interaction: ChatInputCommandInteraction
	) => Awaitable<void>;
}
