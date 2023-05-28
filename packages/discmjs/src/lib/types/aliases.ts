import { ClientEvents } from 'discord.js';
import {
	Command,
	DiscordEvent,
	ParsedSlashCommand,
	ParsedTextCommand
} from './interfaces';

export type AnyCommand = Command<'slash'> | Command<'text'>;
export type AnyEvent = DiscordEvent<keyof ClientEvents>;
export type ParsedCommand = ParsedSlashCommand | ParsedTextCommand;
