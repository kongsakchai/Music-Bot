import { MessageEmbed } from "discord.js";
import Player from "../Class/player";
import { Song } from "../Controllers/song.controller";

export const setupEmbed = (player: Player | undefined = undefined): MessageEmbed => {
    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    if (!player || !player.songNow) {
        embed.setTitle('อาตมาไม่มีเรื่องจะพูดแล้ว')
        embed.setDescription(`พิมพ์ชื่อเพลงหรือลิงค์เพื่อเพิ่มเพลง`);
        embed.setThumbnail('https://i.imgur.com/FYKZr04.jpeg')
    } else {
        embed.setTitle('อาตมาจะแสดงธรรมเทศนาเรื่อง')
        embed.setDescription(`[${player.songNow?.title}](${player.songNow?.url})\n ${getTime(player.songNow?.time)}`);
        embed.addField(``, `ขอโดย โยม<@!${player.songNow?.user}>`, false)

        if (player.songList && player.songList.length > 0) {
            let str = player.songList.map((song: Song, i: number) => {
                return `\n${i + 1} : [${song.title}](${song.url}) <@!${song.user}>`;
            }).join('');
            embed.addField('\u200B', str);
        }

        if (player.songNow?.display) embed.setThumbnail(player.songNow?.display)
    }
    return embed;
}

export const playEmbed = (song: Song): MessageEmbed => {

    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle('อาตมาจะแสดงธรรมเทศนาเรื่อง')
    embed.setDescription(`[${song.title}](${song.url})\n ${getTime(song.time)}`);
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

export const nowEmbed = (song: Song, songList: Song[]): MessageEmbed => {

    const embed = new MessageEmbed()
    embed.setColor('#0099ff')
    embed.setTitle('กำลังเทศน์')
    embed.setDescription(`[${song.title}](${song.url})\n ขอโดย โยม<@!${song.user}> `);

    if (songList && songList.length > 0) {
        let str = songList.map((song: Song, i: number) => {
            return `\n${i + 1} : [${song.title}](${song.url}) <@!${song.user}>`;
        }).join('');
        embed.addField('\u200B', str);
    }

    if (song.display) embed.setThumbnail(song.display);

    return embed;

}

export const getTime = (seconds: number | undefined) => {

    if (!seconds) return '';

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