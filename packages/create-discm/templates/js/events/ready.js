const { DiscmEvent } = require('discm.js');

module.exports = new DiscmEvent({
	name: 'ready',
	run(client) {
		client.logger.success(`${client.user.tag} is online!`);
	}
});
