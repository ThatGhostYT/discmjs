import { Awaitable, ClientEvents } from 'discord.js';
import { DiscordEvent } from '../types/interfaces';
import { DiscmClient } from './Client';

export class DiscmEvent<T extends keyof ClientEvents>
	implements DiscordEvent<T>
{
	public name: T;
	public once: boolean;
	public run: (
		client: DiscmClient,
		...args: ClientEvents[T]
	) => Awaitable<void>;

	constructor(options: DiscordEvent<T>) {
		this.name = options.name;
		this.once = options.once ?? false;
		this.run = options.run;
	}
}
