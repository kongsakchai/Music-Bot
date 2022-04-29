import { MessageEmbed } from "discord.js";
import { Song } from "../Class/player";

export const playEmbed = (song: Song,loop:boolean): MessageEmbed => {

    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle('อาตมาจะแสดงธรรมเทศนาเรื่อง')
    embed.setDescription(`[${song.title}](${song.url})\n ${getTime(song.time)} ${loop?'\non Loop':''}`);
    embed.addField(`\u200B`, `ขอโดย โยม<@!${song.user}>`, false)
    if (song.display) embed.setThumbnail(song.display);
    return embed;
}

export const addEmbed = (song: Song): MessageEmbed => {

    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle('เพิ่มธรรมะเรื่อง')
    embed.setDescription(`[${song.title}](${song.url})\n ${getTime(song.time)}`);
    embed.addField(`\u200B`, `ขอโดย โยม<@!${song.user}>`, false)
    if (song.display) embed.setThumbnail(song.display);
    return embed;
}

export const nowEmbed = (song: Song,loop:boolean): MessageEmbed => {

    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle('กำลังเทศน์')
    embed.setDescription(`[${song.title}](${song.url})\n ขอโดย โยม<@!${song.user}>  ${loop?'\non Loop':''}`);
    if (song.display) embed.setThumbnail(song.display);
    return embed;
}

export const getTime = (seconds: number) => {

    let h = 0;
    let m = 0;
    let s = 0;
    if (seconds / 3600 > 0) {
        h = Math.floor(seconds / 3600);
        seconds -= h * 3600;
    }
    if (seconds / 60 > 0) {
        m = Math.floor(seconds / 60);
        seconds -= m * 60;
    }
    if (seconds > 0) {
        s = seconds;
    }
    return `${h} ชั่วโมง ${m} นาที ${s} วินาที`;
}