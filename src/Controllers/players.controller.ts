import Player from '../Class/player'
import { Guild, Message, StageChannel, TextChannel, VoiceChannel } from "discord.js";
import { createSetup, getSetup, hasSetup, Setup } from './setup.controller';
import { sendSetup } from './send.controller';

const players = new Map<string, Player>();

const getMessage = async (guild: Guild, setup: Setup): Promise<Message | null> => {
    try {
        const channel = await guild.channels.fetch(setup.channel);
        if (!channel || !channel.isText()) return null;
        console.log("Channel Clear");

        try {
            const message = await channel.messages.fetch(setup.message);
            console.log("Message Clear");
            return message;
        } catch {
            const setup = await sendSetup(channel);
            createSetup(setup.guildId!, setup.channelId, setup.id);
            console.log("New Message Clear");
            return setup;
        }

    } catch {
        return null;
    }
}

const createPlayer = async (voiceChannel: VoiceChannel | StageChannel) => {

    const player = new Player(voiceChannel, (p: Player) => {
        players.delete(p.id)
    });

    const setup = getSetup(voiceChannel.guildId)
    if (setup) {
        const message = await getMessage(voiceChannel.guild, setup);
        if (message) player.onSetup(message);
    }
    players.set(voiceChannel.guildId, player);
    return player;
}

const getPlyaer = (id: string): Player | undefined => {

    if (players.has(id))
        return players.get(id)

    return undefined;
};

export { createPlayer, getPlyaer };