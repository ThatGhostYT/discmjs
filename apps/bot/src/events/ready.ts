import { DiscmEvent } from '../../../../packages/discmjs/dist/index';

export default new DiscmEvent({
	name: 'ready',
	once: true,
	run: (client) => {
		client.logger.success(
			`Successfully logged in as ${client.user?.tag!}.`
		);
	}
});
