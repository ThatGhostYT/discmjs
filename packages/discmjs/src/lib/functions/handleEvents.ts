import { readdirSync } from 'node:fs';
import { DiscmClient } from '../classes/Client';
import { AnyEvent } from '../types/aliases';
import { CommandTextOptionValue } from '../types/interfaces';

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
		const prefix = message.content.substring(0, 1);

		if (prefix !== client.prefix) return;
		if (!message.inGuild()) return;

		const args = message.content.slice(1).split(' ');
		const name = args.shift()!;

		const command = client.commands.get(name);

		if (command && command.type === 'text') {
			let options: CommandTextOptionValue[] = [];

			for (let i = 0; i < args.length; i++) {
				const option = command.options[i];
				let type = '';

				if (!/\d/.test(args[i]!) && !/(true)|(false)/i.test(args[i]!))
					type = 'string';
				else type = typeof eval(args[i]!);

				if (type === option?.type)
					options.push({
						valid: false,
						value: ''
					});
				else
					options.push({
						valid: true,
						value:
							type === 'number'
								? Number(args[i]!)
								: type === 'boolean'
								? Boolean(args[i]!)
								: args[i]!
					});
			}

			for (const plugin of command.plugins) {
				const result = plugin.run({ command, client, message });

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
