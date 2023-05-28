import { Message, ChatInputCommandInteraction } from 'discord.js';
import {
	Plugin,
	ParsedTextCommand,
	ParsedSlashCommand
} from '../types/interfaces';
import { DiscmClient } from './Client';

export class DiscmPlugin<T extends 'text' | 'slash'> implements Plugin<T> {
	public type: T;
	public name: string;
	public run: T extends 'text'
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

	constructor(plugin: Plugin<T>) {
		this.type = plugin.type;
		this.name = plugin.name;
		this.run = plugin.run;
	}
}
