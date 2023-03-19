import { format } from 'util';

export class DeployError extends Error {
	constructor(message?: any, options?: ErrorOptions) {
		super(format(message), options);
		this.name = 'DeployError';
	}
}
