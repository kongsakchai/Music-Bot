import { Message, TextBasedChannels } from 'discord.js';
import fs from 'fs';
import button from '../Views/button';
import { setupEmbed } from '../Views/embed.view';

interface Setup {
    guild: string
    channel: string,
    message: string
}

let list: Setup[] = [];

const loadSetup = () => {
    list = JSON.parse(fs.readFileSync(__dirname + '/../public/list.json', 'utf-8'));
}

const createSetup = (guild: string, channel: string, message: string) => {

    const setup = getSetup(guild)

    if (!setup) {

        list.push({
            guild: guild,
            channel: channel,
            message: message,
        });

    } else {
        setup.channel = channel;
        setup.message = message;
    }

    fs.writeFileSync(__dirname + '/../public/list.json', JSON.stringify(list), 'utf-8');

}

const hasSetup = (guild: string): boolean => {
    return list.some(value => value.guild == guild)
}

const getSetup = (guild: string): Setup | undefined => {
    return list.find(value => value.guild == guild)
}

const hasChannel = (guild: string, channel: string): boolean => {
    return list.some(value => value.guild == guild && value.channel == channel)
}

export { Setup, loadSetup, createSetup, hasSetup, getSetup, hasChannel };