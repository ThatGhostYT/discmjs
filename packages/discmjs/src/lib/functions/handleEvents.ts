import { readdirSync } from 'node:fs';
import { DiscmClient } from '../classes/Client';
import { AnyEvent } from '../types/aliases';

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

			if (command && command.type === 'slash')
				command.run(client, interaction);
		}

		if (client.events.get('interactionCreate')) {
			const event = client.events.get('interactionCreate');
			event?.run(client, interaction);
		}
	});

	client.on('messageCreate', (message) => {
		const prefix = message.content.substring(0, 1);

		if (prefix !== client.prefix) return;

		const args = message.content.slice(1).split(' ');
		const name = args.shift()!;

		const command = client.commands.get(name);

		if (command && command.type === 'text')
			command.run(client, message, args);

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
