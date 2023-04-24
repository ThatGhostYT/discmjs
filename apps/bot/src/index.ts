import { DiscmClient } from '../../../packages/discmjs/dist/index';
import { DISCORD_BOT_TOKEN as token } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds'],
	dirs: {
		commands: `${__dirname}/commands`,
		events: `${__dirname}/events`
	}
});

client.login(token);
