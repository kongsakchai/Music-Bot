import { joinVoiceChannel, VoiceConnection, createAudioResource, createAudioPlayer, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import { Message, MessageEmbed, StageChannel, VoiceChannel } from 'discord.js/typings';
import { playEmbed, addEmbed, nowEmbed } from '../Views/embed.view';
import ytdl from 'ytdl-core';
import yts from 'youtube-sr';

export interface Song {
    title: string,
    url: string,
    user: string,
    time: number,
    display: string | undefined
}

export default class Player {

    id: string;
    audioPlayer: AudioPlayer;
    conection: VoiceConnection;
    songList: Song[] = [];
    countdown: any = null;
    message: Message | null = null;
    songNow: Song | undefined;
    loop: boolean = false;

    constructor(voiceChannel: VoiceChannel | StageChannel) {
        this.id = voiceChannel.guildId;
        this.conection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        this.audioPlayer = createAudioPlayer();
        this.conection.subscribe(this.audioPlayer);
        this.audioPlayer.on(AudioPlayerStatus.Idle, (_old, _new) => {

            if (_old.status == AudioPlayerStatus.Playing && _new.status == AudioPlayerStatus.Idle) {
                console.log('end');
                if (this.songList.length > 0)
                    this.play();
                else
                    this.countdown = setTimeout(() => { this.conection.disconnect(); }, 600_000);
            }
        });
        this.countdown = setTimeout(() => { this.conection.disconnect(); }, 600_000);
    }

    private async getSong(search: string): Promise<Song | null> {
        const song: Song = {
            title: '',
            url: '',
            user: '',
            time: 0,
            display: ''
        };

        if (search.includes('https://') || search.includes('www.')) {

            if (search.includes('/playlist?list')) return null;
            const url = (search.includes('https://')) ? search.replace(' ', '') : 'https://' + search.replace(' ', '');

            const songInfo = await ytdl.getInfo(url);
            if (songInfo.videoDetails == null) return null;
            song.title = songInfo.videoDetails.title;
            song.url = songInfo.videoDetails.video_url;
            song.time = parseInt(songInfo.videoDetails.lengthSeconds);
            song.display = songInfo.videoDetails.thumbnails[0].url;

        } else {
            const songInfo = await yts.search(search, { limit: 1, type: 'video' });
            if (songInfo.length == 0) return null;
            song.title = songInfo[0].title ? songInfo[0].title : '';
            song.url = songInfo[0].url;
            song.time = songInfo[0].duration / 1000;
            song.display = songInfo[0].thumbnail?.url;
        }

        return song;
    }

    async addSong(name: string, userId: string) {
        try {

            const song = await this.getSong(name);

            if (song && song.url != '') {
                song.user = userId;
                this.songList.push(song);
                if (this.countdown) {
                    clearTimeout(this.countdown);
                    this.countdown = null;
                    this.play();
                } else {
                    const embed = addEmbed(song);
                    this.message?.channel.send({ embeds: [embed] });
                }
            }
        } catch {
            this.message?.reply(`อาตมาไม่รู้จัก ${name}`);
        }
    }

    async play() {
        try {
            if (this.songList.length > 0) {

                const song = this.songList.shift();

                const yt = ytdl(song!!.url, {
                    quality: "highestaudio",
                    filter: "audioonly",
                    highWaterMark: 1 << 25,
                });

                const resource = createAudioResource(yt);
                this.audioPlayer.play(resource);

                const embed = playEmbed(song!!, this.loop);
                this.message?.channel.send({ embeds: [embed] });
                this.songNow = song;

                if (this.loop) this.songList.push(song!!);

            } else {
                this.message?.reply('อาตมาไม่มีเรื่องจะแสดงแล้ว');
                this.audioPlayer.stop();
                this.songNow = undefined;
            }
        } catch {
            if (this.songList.length > 0)
                this.play();
            else
                this.countdown = setTimeout(() => { this.conection.disconnect(); }, 600_000);
        }
    }

    onLoop() {
        this.loop = !this.loop;
        if (this.loop) {
            if(this.songNow)this.songList.push(this.songNow);
            this.message?.channel.send('เล่นซ้ำ');
        }
        else
            this.message?.channel.send('หยุดเล่นซ้ำ');
    }

    remove(i: number): boolean {
        if (this.songList.length >= i) {
            this.songList.splice(i - 1, 1);
            this.queue();
            return true;
        } else {
            return false;
        }
    }

    stop() {
        if (this.songList.length > 0) {
            this.message?.channel.send('พักก่อนโยม');
            this.songList.splice(0, this.songList.length);
            this.audioPlayer.stop();
        }
    }

    queue() {
        if (this.songNow) {
            const embed = nowEmbed(this.songNow, this.loop);

            if (this.songList.length > 0) {
                let str = this.songList.map((song: Song, i: number) => {
                    return `\n${i + 1} : [${song.title}](${song.url}) <@!${song.user}>`;
                }).join('');
                embed.addField('\u200B', str);
            }
            this.message?.channel.send({ embeds: [embed] });
        }
    }

}