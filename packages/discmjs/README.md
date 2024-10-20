# discm.js

[![homepage](https://img.shields.io/badge/discm.js-homepage-magenta)](https://discm.js.org)
[![downloads](https://img.shields.io/npm/dw/discm.js)](https://npmjs.com/package/discm.js)
[![activity](https://img.shields.io/github/commit-activity/w/ThatGhostYT/discmjs)](https://github.com/ThatGhostYT/discmjs/tree/master)
[![version](https://img.shields.io/npm/v/discm.js)](https://www.npmjs.com/package/discm.js?activeTab=versions)

A framework built on top of and compatible with [discord.js](https://npmjs.com/package/discord.js).

## Installation

You can use our [cli](https://npmjs.com/package/create-discm) to initialize a project.

```shell
npx create-discm@latest
```

It will prompt a series of questions, to skip this use `-y` at the end of the command to bypass all questions.
This will use a set of default values.

> [!NOTE] Using `-y` will initialize the project with javascript automatically. If you wish to use typescript then do not bypass the questions.

## Command and Event Handling

If you look at the commands folder of your project (or [our example bot](https://github.com/ThatGhostYT/discmjs/tree/master/apps/bot)) you will see two directories.

`commands` - each command is represented by a file. The file name is used for the command name.
`events` - each event is also represented by a file. However, the file name is NOT used for the event name.

### Slash Commands

Here is an example slash command made with discm:

```ts
// filename: commands/echo.ts
import { DiscmCommand, CommandOptionType } from 'discm.js';

export default new DiscmCommand({
	type: 'slash',
	description: 'Echoes what you say.',
	options: [
		{
			type: CommandOptionType.String,
			name: 'echo',
			description: 'Phrase to echo.',
			required: true
		}
	],
	run: ({ interaction }) => {
		const echo = interaction.options.getString('echo');

		interaction.reply({
			ephemeral: true,
			content: `${interaction.user}, this is the phrase I am echoing: \`${echo}\``
		});
	}
});
```

All properties are directly deployed to discord's api (except for `type`, `plugins`, `delayDeploy` and `run`).

`type` is for the parser so that it knows which commands are slash and text. Only slash commands are deployed to discord.
`delayDeploy` just delays the deployment of that slash command. If this is set to `true`, the command will NOT deploy until manually done so.
`run` is just the callback function for the command.

### Text Commands

Here is an example text command made with discm:

```ts
// filename: commands/math.ts
import { DiscmCommand } from 'discm.js';

export default new DiscmCommand({
	type: 'text',
	description: 'Does math.',
	options: [
		{
			name: 'process',
			description: 'The process to use.',
			type: 'string',
			choices: [
				{ name: 'add', value: '+' },
				{ name: 'subtract', value: '-' },
				{ name: 'multiply', value: '*' },
				{ name: 'divide', value: '/' }
			]
		},
		{
			name: 'number1',
			description: 'The first number to use in the operation.',
			type: 'number'
		},
		{
			name: 'number2',
			description: 'The second number to use in the operation',
			type: 'number'
		}
	],
	run({ message, options }) {
		const process = options.getString('process');
		const number1 = options.getNumber('number1');
		const number2 = options.getNumber('number2');

		const equation = `${number1}${process}${number2}`;

		message.reply(
			`The result of your equation (\`${equation}\`) is \`${eval(
				equation
			)}\`.`
		);
	}
});
```

Text command options (arguments) are automatically parsed for you, and the system is made to mimic slash command options.

### Events

Here is an example event made with discm:

```ts
// filename: events/ready.ts
import { DiscmEvent } from 'discm.js';

export default new DiscmEvent({
	name: 'ready',
	once: true,
	run(client) {
		client.logger.success(`Successfully logged in as ${client.user?.tag}`);
	}
});
```

This listens for the ready event, which is emitted once the client has officially logged into discord.
The `name` property tells discm which discord event it is listening for.
The `once` property tells discm whether to use `client.on` or `client.once`, the difference between these two methods is that `client.once` only listens for the event once, while there is no set limit to how many times `client.on` will listen for the event.
We use `once` on the `ready` event because it is only emitted one time.
The callback will provide the client, aswell as any arguments the discord event provides.

## The Client

Discm exports a `DiscmClient` class, which extends the `Client` class discord.js exports.

```ts
// filename: lib/classes/Client.ts
export class DiscmClient extends Client {
	//...
}
```

This allows you to use all client methods/properties still. Commands are parsed as soon as the class is initialized

Discord.js requires some data when the class is initialized, and so does discm.

```ts
// filename: index.ts
const client = new DiscmClient({
	// required by discord.js
	intents: ['Guilds', 'GuildMessages', 'MessageContent'],

	// required by discm.js
	dirs: {
		commands: `${__dirname}/commands`,
		events: `${__dirname}/events`
	}
});
```

The `dirs` property specifies which directories to read commands and events from.

### Logging In

Logging into your client in discm is as easy as doing it in discord.js.

```ts
// filename: index.ts
import { TOKEN, PRIVATE_SERVER_ID } from './config.json';

const client = new DiscmClient({
	intents: ['Guilds', 'GuildMessages', 'MessageContent'],
	dirs: {
		commands: `${__dirname}/commands`,
		events: `${__dirname}/events`
	},
	global: false
});

client.login(TOKEN, PRIVATE_SERVER_ID);
```

The `global` property is not required, and is set to `true` by default. This just specifies whether to deploy commands to every guild the bot is in or just a few guilds.

If `global` is true, then the `PRIVATE_SERVER_ID` does not have to be specified, and the code can just be run like this:

```ts
client.login(TOKEN);
```

But if it is false, then the server ids are required. The argument can either be a singular guild id, or an array of guild ids.

### The Help Command

If you set the `autoGenerateHelp` property in the client settings to `true`, then it will automatically create a help command for you.

> An object can also be supplied and this will allow you to configure the help command.

## Command Overloading

Command overloading allows you to make a command that will work both as a text and slash command.

Since using text commands is more limiting than using a slash command, discm treats these as two separate commands, and then in the parsing process merges them together.

To create an overload, make a new file in the `commands` directory and name `<command-name>.overload.ts` or `<command-name>.overload.js` if you are using javascript.

Make sure that a there is a file without the `.overload` or else discm will throw this error:

```txt
CommandError: Cannot overload a command that doesn't exist. Try removing ".overload" from the file name
```

You also need to make sure that the commands are different types, or a similar error will be thrown:

```txt
CommandError: Cannot overload a command with the same type.
```
