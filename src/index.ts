import { token, prefix } from './config'

/*
const prefix: string = '-';
const token: string = '';

export {
	prefix,
	token
}
*/

import { Client, Intents, Interaction, MessageComponentInteraction } from 'discord.js'
import { hasChannel, loadSetup } from './Controllers/setup.controller';
import { nowCommand, playCommand, removeAtCommand, setupCommand, skipCommand, stopCommand } from './Controllers/command.controller';
import { getPlyaer } from './Controllers/players.controller';


const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once("ready", () => {
	loadSetup();
	console.log("Ready!");
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnect!");
});

client.on("messageCreate", (message) => {

	if (!message.content.startsWith(prefix)) {
		console.log(message.guildId!, message.channelId);
		if (hasChannel(message.guildId!, message.channelId) && !message.author.bot)
			playCommand(message);
		return;
	}

	if (message.content === (prefix + 'setup'))
		setupCommand(message);
	else if (message.content.startsWith(prefix + 'p ') || message.content.startsWith(prefix + 'play '))
		playCommand(message);
	else if (message.content.startsWith(prefix + 'r ') || message.content.startsWith(prefix + 'remove '))
		removeAtCommand(message);
	else if (message.content == (prefix + 'r') || message.content == (prefix + 'remove'))
		removeAtCommand(message);
	else if (message.content === (prefix + 'stop'))
		stopCommand(message);
	else if (message.content === (prefix + 's') || message.content === (prefix + 'skip'))
		skipCommand(message);
	else if (message.content === (prefix + 'q'))
		nowCommand(message);
});

client.on('interactionCreate', (interaction: Interaction) => {

	if (interaction.isButton()) {

		const player = getPlyaer(interaction.guildId!)
		if (!player) return;

		if (interaction.customId == 'skip') {
			player.next();
		} else if (interaction.customId == 'stop') {
			player.stop();
		} else if (interaction.customId == 'delete') {
			player.remove();
		}
		interaction.deferUpdate();

	}

});

client.login(token);