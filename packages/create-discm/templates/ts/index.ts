import { DiscmClient } from 'discm.js';
import { TOKEN, PRIVATE_SERVER_ID } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds'], // Add 'GuildMessages' if you wish to add text commands.
	dirs: {
		commands: './commands',
		events: './events'
	},

	// `global` is an optional parameter, if removed it defaults to true
	// If set to false the PRIVATE_SERVER_ID will have to be passed into client.login
	global: true
});

client.login(TOKEN); // Add PRIVATE_SERVER_ID if global is set to false.
