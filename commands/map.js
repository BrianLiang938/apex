const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');
const { apiToken } = require('../config.json');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	return JSON.parse(fullBody);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Returns the current map'),
	async execute(interaction) {
		const dictResult = await request(`https://api.mozambiquehe.re/maprotation?auth=${apiToken}`);
		const global = await getJSONResponse(dictResult.body);
		if (global == null) {
			interaction.editReply('Error: JSON not found');
		}
		else {
			interaction.editReply(`Current Map: ${global.current.map} for ${global.current.remainingTimer}\nNext Map: ${global.next.map}`);
		}
	},
};