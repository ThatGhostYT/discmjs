import { DiscmClient } from '../classes/Client';
import {
	EmbedBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	ActionRowBuilder,
} from 'discord.js';
import { AutoGeneratedHelpSettings } from '../types/interfaces';
import { CommandOptionType } from '../..';

async function buildEmbed(client: DiscmClient, name: string | null) {
	const embed = new EmbedBuilder()
		.setThumbnail(
			client.user?.displayAvatarURL({
				extension: 'png',
				forceStatic: true
			})!
		)
		.setFooter({
			text: 'Help command generated by discm.js'
		})
		.setColor(
			(client.autoGenerateHelp as AutoGeneratedHelpSettings)
				.color
				? (
						client.autoGenerateHelp as AutoGeneratedHelpSettings
				  ).color!
				: 'Blurple'
		)
		.setTimestamp();

	if (name) {
		const command = client.commands.get(name)!;

		embed.setTitle(
			`${
				name.slice(0, 1).toUpperCase() + name.slice(1)
			} Command Help Menu`
		);

		if (command.type === 'slash') {
			if (command.data.options) {
				embed.setDescription(
					command.description! +
						`This command is a **slash (/)** command. It has **${
							command.data.options.length
						}** option${
							command.data.options.length === 1
								? ''
								: 's'
						}.`
				);

				for (const option of command.data.options) {
					embed.addFields({
						name:
							option.name,
						value: `**${
							option.required
								? 'Required'
								: 'Optional'
						}**\n${
							option.description
						} It accepts **${CommandOptionType[
							option.type
						].toLowerCase()}** values.`,
						inline: true
					});
				}
			} else
				embed.setDescription(
					command.description! +
						`This command is a **slash (/)** command. It does not have any options.`
				);
		} else if(command.type === "text"){
			embed.setDescription(
				command.description! +
					` This command is a **text** command. It has **${
						command.options.length
					}** option${
						command.options.length === 1 ? '' : 's'
					}. The prefix for text commands is \`${
						client.prefix
					}\`.`
			);

			for (const option of command.options) {
				embed.addFields({
					name: option.name,
					value: `${option.description} It accepts **${
						option.type
					}** values.${
						option.choices
							? ' Only the following values: ' +
							  option.choices
									.map((c) => `\`${c.name}\``)
									.join(', ')
							: ''
					}.`,
					inline: true
				});
			}
		} else{
			embed.setDescription(
				command.description! +
					` This command works for both **text** and **slash** commands. The prefix for text commands is \`${
						client.prefix
					}\`.`
			);

			for (const option of command.options) {
				embed.addFields({
					name: option.name,
					value: `${option.description} It accepts **${
						option.type
					}** values.${
						option.choices
							? ' Only the following values: ' +
							  option.choices
									.map((c) => `\`${c.name}\``)
									.join(', ')
							: ''
					}.`,
					inline: true
				});
			}

			for (const option of command.data.options!) {
				embed.addFields({
					name:
						option.name + " (/)",
					value: `**${
						option.required
							? 'Required'
							: 'Optional'
					}**\n${
						option.description
					} It accepts **${CommandOptionType[
						option.type
					].toLowerCase()}** values.`,
					inline: true
				});
			}
		}
	} else {
		embed
			.setTitle(`${client.user?.username} Help Menu`)
			.setDescription(
				(
					client.autoGenerateHelp as AutoGeneratedHelpSettings
				).description
					? (
							client.autoGenerateHelp as AutoGeneratedHelpSettings
					  ).description!
					: client.application?.description ||
							`Here are the commands for: ${client.user!}`
			);

		for (const [name, command] of client.commands) {
			embed.addFields({
				name,
				value: `${
					command.description
				}\nCommand \`${name}\` is a **${command.type === "overload" ? "both" : command.type}** command.`,
				inline: true
			});
		}
	}

	return embed;
}

/**
 * Generates a help command for the client.
 * @param client The client generating the help command.
 */
export function generateHelp(client: DiscmClient) {
	client.commands.set('help', {
		type: 'overload',
		name: 'help',
		description: 'Help command for the bot, auto generated by discm.js.',
		plugins: [],
		options: [],
		delayedDeploy: false,
		data: {
			name: 'help',
			description:
				'Help command for the bot, auto generated by discm.js.',
			options: [
				{
					name: 'command',
					description: 'A specific command you want help on.',
					type: 3,
					choices: [{ name: 'help', value: 'help' }].concat(
						client.commands.map((_, name) => ({
							name,
							value: name
						}))
					)
				}
			]
		},
		async slashRun(client, interaction) {
			await interaction.deferReply({ ephemeral: true });

			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('help-menu-select')
				.setPlaceholder('Command');

			for (const [name, command] of client.commands) {
				selectMenu.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(name)
						.setDescription(command.description!)
						.setValue(name)
				);
			}

			const response = await interaction.editReply({
				embeds: [
					(
						await buildEmbed(
							client,
							interaction.options.getString('command')
						)
					).toJSON()
				],
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						selectMenu
					)
				]
			});

			const collector = response.createMessageComponentCollector<3>({
				filter: (i) =>
					i.user.id === interaction.user.id &&
					i.customId === 'help-menu-select',
				time: 300000
			});

			collector.on('collect', async (i) => {
				i.update({
					embeds: [(await buildEmbed(client, i.values[0]!)).toJSON()]
				});
			});

			collector.on('end', () => {
				interaction.editReply({
					components: [
						new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
							selectMenu.setDisabled()
						)
					]
				});
			});
		},
		async textRun(client,message){
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('help-menu-select')
				.setPlaceholder('Command');

			for (const [name, command] of client.commands) {
				selectMenu.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel(name)
						.setDescription(command.description!)
						.setValue(name)
				);
			}

			const response = await message.reply({
				embeds: [await buildEmbed(client,null)],
				components: [
					new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
						selectMenu
					)
				]
			});

			const collector = response.createMessageComponentCollector<3>({
				filter: (i) =>
					i.user.id === message.author.id &&
					i.customId === 'help-menu-select',
				time: 300000
			});

			collector.on('collect', async (i) => {
				i.update({
					embeds: [(await buildEmbed(client, i.values[0]!)).toJSON()]
				});
			});

			collector.on('end', () => {
				response.edit({
					components: [
						new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
							selectMenu.setDisabled()
						)
					]
				});
			});
		}
	});
}
