import { joinVoiceChannel, VoiceConnection, createAudioResource, createAudioPlayer, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import { Message, StageChannel, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { Song } from '../Controllers/song.controller';
import { updateSetup } from '../Controllers/send.controller';

export default class Player {

    id: string;
    conection: VoiceConnection;
    audioPlayer: AudioPlayer;
    songList: Song[] = [];
    countdown: any = null;
    message: Message | null = null;
    setup: boolean = false;
    songNow: Song | undefined;
    loop: boolean = false;

    constructor(voiceChannel: VoiceChannel | StageChannel, disconnectCallback: (player: Player) => void) {
        this.id = voiceChannel.guildId;
        this.conection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });
        this.conection.on("stateChange", () => {
            if (disconnectCallback && this.conection.state.status == 'disconnected') {
                disconnectCallback(this);
            }
        });


        this.audioPlayer = createAudioPlayer();
        this.audioPlayer.on(AudioPlayerStatus.Idle, (_old, _new) => {

            if (_old.status == AudioPlayerStatus.Playing && _new.status == AudioPlayerStatus.Idle) {
                this.next();
            }
        });

        this.conection.subscribe(this.audioPlayer);
        this.countdown = setTimeout(() => { this.conection.disconnect(); }, 600_000);
    }

    onSetup(message: Message) {
        this.setup = true;
        this.message = message;
    }

    async next() {
        if (this.songList.length > 0) {
            await this.play();
            if (this.setup) updateSetup(this);
        }
        else {
            this.audioPlayer.stop();
            this.songNow = undefined;
            this.countdown = setTimeout(() => { this.conection.disconnect(); }, 600_000);
            if (this.setup) updateSetup(this);
        }
    }

    async addSong(song: Song) {

        this.songList.push(song);
        if (this.countdown) {
            clearTimeout(this.countdown);
            this.countdown = null;
            await this.play();
            if (this.setup) updateSetup(this);
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
                this.songNow = song;

            }
        } catch {
            this.next();
        }
    }

    async remove(i: number | undefined = undefined): Promise<boolean> {
        if (!i) {
            if (this.songList.length >= 1) {
                this.songList.pop();
                return true;
            }
            return false;
        }
        else if (this.songList.length >= i) {
            this.songList.splice(i - 1, 1);
            return true;
        } else {
            return false;
        }
    }

    async stop() {
        this.songList = [];
        await this.next();
        if (this.setup) updateSetup(this);
    }

}