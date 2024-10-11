import { format } from 'util';

/**
 * An error returned when something goes wrong with deployment.
 */
export class DeployError extends Error {
	constructor(message?: any, options?: ErrorOptions) {
		super(format(message), options);
		this.name = 'DeployError';
	}
}
