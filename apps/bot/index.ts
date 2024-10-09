import { DiscmClient } from 'discm.js';
import { TOKEN, PRIVATE_SERVER_ID } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds', 'GuildMessages', 'MessageContent'],
	dirs: {
		commands: `${__dirname}/commands`,
		events: `${__dirname}/events`
	},
	global: false,
	autoGenerateHelpCommand: true
});

client.login(TOKEN, PRIVATE_SERVER_ID);
