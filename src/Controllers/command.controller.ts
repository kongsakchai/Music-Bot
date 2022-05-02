import { GuildMember, Message, StageChannel, VoiceChannel } from "discord.js";
import { prefix } from "../config";
import { createPlayer, getPlyaer } from "./players.controller";
import { sendAdd, sendNow, sendPlay, sendSetup, updateSetup } from "./send.controller";
import { createSetup } from "./setup.controller";
import { searchSong } from "./song.controller";

const getVoiceChannel = (member: GuildMember): VoiceChannel | StageChannel | null => {

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
        return null
    }
    return voiceChannel;
}

const getValue = (content: string): string => {
    const i = (content.startsWith(prefix)) ? content.indexOf(' ') : -1;
    return content.substring(i + 1);
}

//---Command---//

const setupCommand = async (message: Message) => {
    const setup = await sendSetup(message.channel);
    createSetup(setup.guildId!, setup.channelId, setup.id);
    message.delete();
    return console;
}

const playCommand = async (message: Message) => {

    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    if (!player) {
        player = await createPlayer(voiceChannel);
    }

    const value = getValue(message.content);
    try {

        const song = await searchSong(value);
        if (!song) return;

        song.user = message.author.id;
        await player.addSong(song);

        if (!player.setup) {
            if (player.songList.length > 0)
                sendAdd(message.channel, song);
            else
                sendPlay(message.channel, song);
        }

    } catch {

    }
}

const skipCommand = async (message: Message) => {

    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    if (player) {
        await player.next();

        if (!player.setup && player.songNow)
            sendPlay(message.channel, player.songNow);
    }
}

const stopCommand = async (message: Message) => {

    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    if (player) {
        await player.stop();
    }
}

const nowCommand = async (message: Message) => {

    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    if (player) {
        if (player.setup)
            updateSetup(player);
        else if (player.songNow)
            sendNow(message.channel, player.songNow, player.songList);
        else
            message.reply("อาตมาไม่มีเรื่องจะพูดแล้ว")
    }
}

const removeAtCommand = async (message: Message) => {
    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    const value = getValue(message.content);
    const [ok, num] = tryPasre(value);

    if (player && ok) {
        const ok2 = await player.remove(num);
        if (ok2) {
            if (player.setup)
                updateSetup(player);
            else if (player.songNow)
                sendNow(message.channel, player.songNow, player.songList);
            else
                message.reply("อาตมาไม่มีเรื่องจะพูดแล้ว")
        }
    }
}

const removeCommand = async (message: Message) => {
    const voiceChannel = getVoiceChannel(message.member!);
    if (!voiceChannel) return;

    const id = voiceChannel.guildId;
    let player = getPlyaer(id);

    if (player) {
        const ok2 = await player.remove();
        if (ok2) {
            if (player.setup)
                updateSetup(player);
            else if (player.songNow)
                sendNow(message.channel, player.songNow, player.songList);
            else
                message.reply("อาตมาไม่มีเรื่องจะพูดแล้ว")
        }
    }
}

const tryPasre = (str: string): [boolean, number] => {
    try {
        const num = parseInt(str);
        return [true, num]
    } catch {
        return [false, 0]
    }
}

export { playCommand, setupCommand, skipCommand, stopCommand, removeAtCommand, removeCommand, nowCommand }