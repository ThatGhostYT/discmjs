import { Awaitable, ClientEvents } from 'discord.js';
import { DiscordEvent } from '../types/interfaces';
import { DiscmClient } from './Client';

/**
 * A discm event.
 */
export class DiscmEvent<T extends keyof ClientEvents>
	implements DiscordEvent<T>
{
	/**
	 * The name of the discord event.
	 */
	public name: T;

	/**
	 * Whether to use {@link Client.Once} or {@link Client.On}
	 */
	public once: boolean;

	/**
	 * The callback of the event.
	 */
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
