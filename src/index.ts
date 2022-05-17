import { token, prefix } from './config'

import { Client, Intents, Interaction } from 'discord.js'
import { hasChannel, loadSetup } from './Controllers/setup.controller';
import { disconnectCommand, nowCommand, playCommand, removeAtCommand, setupCommand, skipCommand, stopCommand } from './Controllers/command.controller';
import { getPlayer, getPlayerDetail } from './Controllers/players.controller';
import express, { Application, Request, Response } from 'express';

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
	else if (message.content === (prefix + 'dis'))
		disconnectCommand(message);
});

client.on('interactionCreate', (interaction: Interaction) => {

	if (interaction.isButton()) {

		const player = getPlayer(interaction.guildId!)
		if (player) {

			if (interaction.customId == 'skip') {
				player.next();
			} else if (interaction.customId == 'stop') {
				player.stop();
			} else if (interaction.customId == 'delete') {
				player.remove();
			}
		}
		interaction.deferUpdate();

	}

});

client.login(token);

//-------------------------------------------

const app: Application = express()

app.get("/list", (req: Request, res: Response) => {

	res.send(200).json(getPlayerDetail());

});

app.listen(3000);