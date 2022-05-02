import { Message, TextBasedChannels } from "discord.js";
import Player from "../Class/player";
import button from "../Views/button";
import { addEmbed, nowEmbed, playEmbed, setupEmbed } from "../Views/embed.view";
import { Song } from "./song.controller";

const sendSetup = async (channel: TextBasedChannels): Promise<Message> => {
    const setup = await channel.send({ embeds: [setupEmbed()], components: [button()] })
    return setup;
}

const updateSetup = async (player: Player): Promise<Message> => {
    return await player.message!.edit({ embeds: [setupEmbed(player)], components: [button(player.loop)] })
}

const sendPlay = async (channel: TextBasedChannels, song: Song) => {
    return await channel.send({ embeds: [playEmbed(song)] });
}

const sendAdd = async (channel: TextBasedChannels, song: Song) => {
    return await channel.send({ embeds: [addEmbed(song)] });
}

const sendNow = async (channel: TextBasedChannels, song: Song, songList: Song[]) => {
    return await channel.send({ embeds: [nowEmbed(song, songList)] });
}


export { sendSetup, updateSetup, sendAdd, sendPlay, sendNow }