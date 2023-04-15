import { ClientEvents, Collection } from 'discord.js';
import { ReadonlyCollection } from '@discordjs/collection';
import {
	Command,
	DiscordEvent,
	ParsedSlashCommand,
	ParsedTextCommand
} from './interfaces';

export type AnyCommand = Command<'slash'> | Command<'text'>;
export type AnyEvent = DiscordEvent<keyof ClientEvents>;
export type ParsedCommand = ParsedSlashCommand | ParsedTextCommand;
export type Immutable<T> = T extends Array<infer U>
	? ReadonlyArray<U>
	: T extends Map<infer K, infer V>
	? ReadonlyMap<K, V>
	: T extends Collection<infer K, infer V>
	? ReadonlyCollection<K, V>
	: {
			readonly [P in keyof T as T[P] extends (...args: any[]) => unknown
				? never
				: P]: T[P];
	  };
