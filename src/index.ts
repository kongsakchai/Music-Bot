import { token, prefix } from './config'

/*
const prefix: string = '-';
const token: string = '';

export {
    prefix,
    token
}
*/

import { Client, Intents } from 'discord.js'
import { loopCommand, playCommand, queueCommand, removeCommand, skipCommand, stopCommand } from './Controllers/message.controller';
import { read, addList, hasList, list } from './Controllers/read.controller';


const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once("ready", () => {
	read();
	console.log("Ready!");
});

client.once("reconnecting", () => {
	console.log("Reconnecting!");
});

client.once("disconnect", () => {
	console.log("Disconnect!");
});

client.on("messageCreate", (message) => {
	console.log(message.channelId);

	if (!message.content.startsWith(prefix)) {
		if (hasList(message.channelId) && !message.author.bot)
			playCommand(message);
		return;
	}

	if (message.content.startsWith(prefix + 'p ') || message.content.startsWith(prefix + 'play '))
		playCommand(message);
	else if (message.content.startsWith(prefix + 'r '))
		removeCommand(message);
	else if (message.content === (prefix + 'stop'))
		stopCommand(message);
	else if (message.content === (prefix + 's') || message.content === (prefix + 'skip'))
		skipCommand(message);
	else if (message.content === (prefix + 'q'))
		queueCommand(message);
	else if (message.content === (prefix + 'read'))
		addList(message.channelId);
	else if (message.content === (prefix + 'loop'))
		loopCommand(message);
	/*else if (message.content === (prefix + '-show'))
		showCommand(message);*/
});

client.login(token);