import Player from '../Class/player'
import { Guild, Message, StageChannel, VoiceChannel } from "discord.js";
import { createSetup, getSetup, Setup } from './setup.controller';
import { sendSetup, updateSetup } from './send.controller';

const players = new Map<string, Player>();

interface Detail {
    _name: string,
    _status: string,
    _timeout: string
}

const getMessage = async (guild: Guild, setup: Setup): Promise<Message | null> => {
    try {
        const channel = await guild.channels.fetch(setup.channel);
        if (!channel || !channel.isText()) return null;
        try {
            const message = await channel.messages.fetch(setup.message);
            return message;
        } catch {
            const setup = await sendSetup(channel);
            createSetup(setup.guildId!, setup.channelId, setup.id);
            return setup;
        }

    } catch {
        return null;
    }
}

const createPlayer = async (voiceChannel: VoiceChannel | StageChannel) => {

    const player = new Player(voiceChannel, (p: Player) => {
        updateSetup(p);
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

const getPlayer = (id: string): Player | undefined => {

    if (players.has(id))
        return players.get(id)

    return undefined;
};

const getPlayerDetail = (): Detail[] => {

    const data: Detail[] = []
    players.forEach((value: Player, key: string, map: Map<string, Player>) => {

        data.push({
            _name: value._name,
            _status: value._time.message,
            _timeout: value._time.time
        })

    })

    return data;

}

export { createPlayer, getPlayer, getPlayerDetail };