import { DiscmEvent } from 'discm.js';

export default new DiscmEvent({
	name: 'ready',
	run(client) {
		client.logger.success(`${client.user.tag} is online!`);
	}
});
