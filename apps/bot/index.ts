import { DiscmClient } from 'discm.js';
import { TOKEN, PRIVATE_SERVER_ID } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds', 'GuildMessages'],
	dirs: {
		commands: `${__dirname}/commands`,
		events: `${__dirname}/events`
	},
	global: false
});

client.login(TOKEN, PRIVATE_SERVER_ID);
