import { Message } from "discord.js";
import { prefix } from "../config";
import Player from "../Class/player";

const players = new Map<string, Player>();

const playCommand = (message: Message) => {

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }
    const id = voiceChannel.guildId;

    if (!players.has(id)) {
        const player = new Player(voiceChannel);
        players.set(id, player);
        console.log("Start");

        player.conection.on("stateChange", () => {
            if (player.conection.state.status == 'disconnected') {
                players.delete(player.id);
                //console.log("End");
            }
        });
    }

    const i = (message.content.startsWith(prefix)) ? message.content.indexOf(' ') : -1;
    const name = message.content.substring(i + 1);

    players.get(id)!!.message = message;
    players.get(id)!!.addSong(name, message.member!!.id);
}

const skipCommand = (message: Message) => {

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }
    const id = voiceChannel.guildId;
    if (players.has(id)) {
        players.get(id)!!.message = message;
        players.get(id)?.play();
    }
}

const removeCommand = (message: Message) => {

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }

    const id = voiceChannel.guildId;
    const i = message.content.indexOf(' ');
    const index = message.content.substring(i + 1);

    if (players.has(id)) {
        players.get(id)?.remove(parseInt(index));
    }
}

const stopCommand = (message: Message) => {

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }

    const id = voiceChannel.guildId;

    if (players.has(id)) {
        players.get(id)?.stop();
    }
}

const queueCommand = (message: Message)=>{
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }
    const id = voiceChannel.guildId;
    if (players.has(id)) {
        players.get(id)!!.message = message;
        players.get(id)?.queue();
    }
}

const loopCommand = (message:Message)=>{
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
        message.reply("โยมไม่ได้อยู๋ในห้องเสียง");
        return;
    }
    const id = voiceChannel.guildId;
    if (players.has(id)) {
        players.get(id)!!.message = message;
        players.get(id)?.onLoop();
    }
}

export { playCommand, skipCommand, removeCommand, stopCommand,queueCommand,loopCommand };
//export { playCommand, skipCommand, queueCommand, showCommand, stopCommand, removeCommand,jookCommand }