import { ClientEvents } from 'discord.js';
import {
	Command,
	DiscordEvent,
	ParsedSlashCommand,
	ParsedTextCommand,
	CommandTextOption
} from './interfaces';

/**
 * An aliase type for a command that can be either slash (/) or text.
 */
export type AnyCommand = Command<'slash'> | Command<'text'>;

/**
 * An aliase type for any discord client event.
 */
export type AnyEvent = DiscordEvent<keyof ClientEvents>;

export type AnyCommandTextOption = CommandTextOption<
	'string' | 'boolean' | 'number'
>;

/**
 * An aliase type for a parsed command that can be either slash (/) or text.
 */
export type ParsedCommand = ParsedSlashCommand | ParsedTextCommand;
