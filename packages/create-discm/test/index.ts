/* Made with `create-discm` cli */

import { DiscmClient } from 'discm.js';
import { TOKEN, PRIVATE_SERVER_ID } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds'], // Add 'GuildMessages' and 'MessageContent' if you wish to add text commands.
	dirs: {
		commands: './commands',
		events: './events'
	},

	// `global` is an optional parameter, if removed it defaults to true
	// If set to false the PRIVATE_SERVER_ID will have to be passed into client.login
	global: true,

	// Discm.JS will automatically generate a help command for you.
	// If you want to use the default settings, set this option to `true`.
	autoGenerateHelpCommand: {
		// The description goes directly into an embed.
		// Will default to your applications description
		// or "Here are the commands for (your bot):" if your app doesn't have a provided description.
		description: 'blah blah blah',

		// This color goes directly into an embed, meaning it has to be of type `ColorResolvable`
		// Will default to "Blurple".
		color: 'DarkBlue'
	}
});

client.login(TOKEN); // Add PRIVATE_SERVER_ID if global is set to false.
