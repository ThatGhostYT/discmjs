import { Plugin } from '../types/interfaces';
import { MessageReplyOptions } from 'discord.js';

export namespace Plugins {
	/**
	 * Checks if every option for a text command is valid.
	 * @param onInvalid The message to send when an option is invalid.
	 */
	export function EveryOptionValid(
		onInvalid: string | MessageReplyOptions
	): Plugin<'text'> {
		return {
			type: 'text',
			name: 'EveryOptionValid',
			run({ client, message, options }) {
				for (const option of Object.values(options)) {
					if (!option.valid) {
						client.logger.error(option);
						message.reply(onInvalid);
						return 'stop';
					}
				}

				return 'continue';
			}
		};
	}
}
