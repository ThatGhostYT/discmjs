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

			if (command && command.type === 'slash') {
				for (const plugin of command.plugins) {
					const result = plugin.run({ command, client, interaction });

					if (result === 'stop') return;
				}

				command.run(client, interaction);
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

		if (command && command.type === 'text') {
			let options: CommandTextOptionResults = {};

			for (let i = 0; i < args.length; i++) {
				const option = command.options[i]!;
				let type = '';

				if (!/\d/.test(args[i]!) && !/(true)|(false)/i.test(args[i]!))
					type = 'string';
				else type = typeof eval(args[i]!.toLowerCase());

				if (type !== option.type)
					options[option.name] = {
						name: option.name,
						valid: false,
						value: args[i]!
					};
				else if (
					option.type === 'string' &&
					option.choices &&
					!option.choices.includes(args[i]!)
				) {
					options[option.name] = {
						name: option.name,
						valid: false,
						value: args[i]!
					};
				} else
					options[option.name] = {
						name: option.name,
						valid: true,
						value:
							type === 'number'
								? Number(args[i]!)
								: type === 'boolean'
								? Boolean(args[i]!)
								: args[i]!
					};
			}

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
