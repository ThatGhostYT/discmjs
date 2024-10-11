import { format } from 'util';

/**
 * An error returned when something goes wrong with a command.
 */
export class CommandError extends Error {
	constructor(message?: any, options?: ErrorOptions) {
		super(format(message), options);
		this.name = 'CommandError';
	}
}
