import { Awaitable, ChatInputCommandInteraction, Message } from 'discord.js';
import { Command, CommandTextOptionValue } from '../types/interfaces';
import { DiscmClient } from './Client';

export class DiscmCommand<T extends 'slash' | 'text'> implements Command<T> {
	public name: string;
	public description: string;
	public type: T;
	public run: T extends 'slash'
		? (args: {
				client: DiscmClient;
				interaction: ChatInputCommandInteraction;
		  }) => Awaitable<void>
		: (args: {
				client: DiscmClient;
				message: Message;
				options: CommandTextOptionValue[];
		  }) => Awaitable<void>;

	constructor(command: Command<T>) {
		this.name = command.name || '';
		this.description = command.description;
		this.type = command.type;
		this.run = command.run;
	}

	public setName(name: string) {
		this.name = name;
		return this;
	}

	public setDescription(description: string) {
		this.description = description;
		return this;
	}
}
