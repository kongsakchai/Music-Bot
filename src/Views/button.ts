import { MessageActionRow, MessageButton } from "discord.js";

const LoopButton = (onLoop: boolean = false): MessageButton => new MessageButton({
    customId: 'loop',
    label: (onLoop) ? 'Loop on' : 'Loop off',
    style: (onLoop) ? 'SUCCESS' : 'SECONDARY'
});

const SkipButton = new MessageButton({
    customId: 'skip',
    label: 'Skip',
    style: 'PRIMARY'
});

const StopButton = new MessageButton({
    customId: 'stop',
    label: 'Stop',
    style: 'DANGER'
});

const DeleteButton = new MessageButton({
    customId: 'delete',
    label: 'Remove',
    style: 'SECONDARY'
});

export default (onLoop: boolean = false): MessageActionRow => {
    return new MessageActionRow({
        components: [
            SkipButton,
            StopButton,
            DeleteButton
        ]
    });
};