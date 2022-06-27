const { SlashCommandBuilder } = require('@discordjs/builders');
const { request } = require('undici');
const { apiToken } = require('../config.json');

async function getJSONResponse(body) {
	let fullBody = '';

	for await (const data of body) {
		fullBody += data.toString();
	}
	console.log(fullBody);
	return JSON.parse(fullBody);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lookup')
		.setDescription('Replies with Pong!')
		.addStringOption(option =>
			option.setName('username')
				.setDescription('user to lookup')
				.setRequired(true)),
	async execute(interaction) {
		const player = interaction.options.getString('player');
		const pl = new URLSearchParams({ player });

		const dictResult = await request(`https://api.mozambiquehe.re/bridge?auth=${apiToken}&player=${pl}&platform=PC`);
		const { global } = await getJSONResponse(dictResult.body);
		if (global == null) {
			interaction.editReply(`No results for ${player}`);
		}
		else {
			interaction.editReply(`${player}: ${global.name}\nRank: ${global.rankName} ${global.rankDiv}`);
		}
	},
};