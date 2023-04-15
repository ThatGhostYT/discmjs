import { Message, ChatInputCommandInteraction } from 'discord.js';
import { AnyCommand, Immutable } from '../types/aliases';
import { Plugin } from '../types/interfaces';
import { DiscmClient } from './Client';

export class DiscmPlugin<T extends 'text' | 'slash' | 'middleware'>
	implements Plugin<T>
{
	public type: T;
	public name: string;
	public run: T extends 'message'
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

	constructor(plugin: Plugin<T>) {
		this.type = plugin.type;
		this.name = plugin.name;
		this.run = plugin.run;
	}
}
