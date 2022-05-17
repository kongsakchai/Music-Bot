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
    countdown: NodeJS.Timeout | undefined = undefined;
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
                if (this.songNow) this.next();
            }
        });

        this.conection.subscribe(this.audioPlayer);
    }

    setCountdown() {
        if (this.countdown) clearTimeout(this.countdown);
        this.countdown = setTimeout(() => {
            console.log('Time out')
            this.conection.disconnect();
        }, 600_000);
    }

    onSetup(message: Message) {
        this.setup = true;
        this.message = message;
    }

    next() {

        if (this.songList.length > 0) {
            this.play();
        }
        else {
            this.songNow = undefined;
            this.setCountdown();
            this.audioPlayer.stop();
        }

        if (this.setup) updateSetup(this);

    }

    addSong(song: Song) {
        if (this.countdown) clearTimeout(this.countdown);
        this.songList.push(song);
        if (!this.songNow) this.play();
        if (this.setup) updateSetup(this);
    }

    play() {

        try {
            const song = this.songList.shift();
            this.songNow = song;

            const yt = ytdl(song!!.url, {
                quality: "highestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25,
            });

            const resource = createAudioResource(yt);
            this.audioPlayer.play(resource);
        } catch {
            this.next();
        }
    }

    remove(i: number | undefined = undefined): boolean {
        if (!i) {
            if (this.songList.length >= 1) {
                this.songList.pop();
                if (this.setup) updateSetup(this);
                return true;
            }
            return false;
        }
        else if (this.songList.length >= i) {
            this.songList.splice(i - 1, 1);
            if (this.setup) updateSetup(this);
            return true;
        } else {
            return false;
        }
    }

    stop() {
        this.songList = [];
        this.next();
        if (this.setup) updateSetup(this);
    }

    dis(){
        this.conection.disconnect();
    }

}