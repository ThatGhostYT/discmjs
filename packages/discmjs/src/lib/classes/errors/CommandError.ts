import { format } from 'util';

export class CommandError extends Error {
	constructor(message?: any, options?: ErrorOptions) {
		super(format(message), options);
		this.name = 'CommandError';
	}
}
