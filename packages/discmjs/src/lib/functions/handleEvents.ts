import { readdirSync } from 'node:fs';
import { DiscmClient } from '../classes/Client';
import { AnyEvent } from '../types/aliases';
import { CommandTextOptionResults } from '../types/interfaces';

/**
 * Listens for all client events.
 * @param client The client with the events.
 * @param eventsDir The directory where all client events are located.
 */
export const handleEvents = async (client: DiscmClient, eventsDir: string) => {
	for (const file of readdirSync(eventsDir).filter(
		(f) => f.endsWith('.js') || (f.endsWith('.ts') && !f.endsWith('.d.ts'))
	)) {
		const event = (await import(`${eventsDir}/${file}`))
			?.default as AnyEvent;

		client.events.set(event.name, event);
	}

	client.on('interactionCreate', (interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);

			if (
				command &&
				(command.type === 'slash' || command.type === 'overload')
			) {
				if (command.type === 'overload') {
					command.slashRun(client, interaction);
				} else {
					for (const plugin of command.plugins) {
						const result = plugin.run({
							command,
							client,
							interaction
						});

						if (result === 'stop') return;
					}

					command.run(client, interaction);
				}
			}
		}

		if (client.events.get('interactionCreate')) {
			const event = client.events.get('interactionCreate');
			event?.run(client, interaction);
		}
	});

	client.on('messageCreate', (message) => {
		const prefix = message.content.substring(0, client.prefix.length);

		if (prefix !== client.prefix) return;
		if (!message.inGuild()) return;

		const args = message.content.slice(1).split(' ');
		const name = args.shift()!;

		const command = client.commands.get(name);

		if (
			command &&
			(command.type === 'text' || command.type === 'overload')
		) {
			let options: CommandTextOptionResults = {
				getString(name) {
					const option = command.options.find(
						(o) => o.name === name && o.type === 'string'
					);
					const order = command.options.map((o) => o.name);

					if (option === undefined) return '';
					else {
						const i = order.findIndex((o) => o === option.name);
						const value = args[i];

						if (value === undefined) return '';

						if (/\d/.test(value)) return '';
						if (/(true)|(false)/.test(value)) return '';

						if (option.choices) {
							if (
								!option.choices
									.map((c) => c.name)
									.includes(value)
							)
								return '';
							else
								return option.choices.find(
									(c) => c.name === value
								)?.value!;
						} else {
							return value;
						}
					}
				},

				getNumber(name) {
					const option = command.options.find(
						(o) => o.name === name && o.type === 'number'
					);
					const order = command.options.map((o) => o.name);

					if (option === undefined) return NaN;
					else {
						const i = order.findIndex((o) => o === option.name);
						const value = args[i];

						if (value === undefined) return NaN;

						if (/(true)|(false)/.test(value)) return NaN;

						return Number(value);
					}
				},

				getBoolean(name) {
					const option = command.options.find(
						(o) => o.name === name && o.type === 'boolean'
					);
					const order = command.options.map((o) => o.name);

					if (option === undefined) return '';
					else {
						const i = order.findIndex((o) => o === option.name);
						const value = args[i];

						if (value === undefined) return '';

						if (/\d/.test(value)) return '';

						return Boolean(value);
					}
				}
			};

			if (command.type === 'overload') {
				command.textRun(client, message, options);
			} else {
				for (const plugin of command.plugins) {
					const result = plugin.run({
						command,
						client,
						message,
						options
					});

					if (result === 'stop') return;
				}

				command.run(client, message, options);
			}
		}

		if (client.events.get('messageCreate')) {
			const event = client.events.get('messageCreate');
			event?.run(client, message);
		}
	});

	for (const [, event] of client.events) {
		client[event.once ? 'once' : 'on'](event.name, (...args) =>
			event.run(client, ...args)
		);
	}
};
