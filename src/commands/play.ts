import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
import { join } from "path";
import ytdl from 'ytdl-core';
import fs from 'fs';

export const data = new SlashCommandBuilder()
    .addStringOption(option =>
        option.setName("link")
            .setDescription("Link to the audio source to be played.")
            .setRequired(true)
    )
    .setName("play")
    .setDescription("Plays audio from given URL.");

export async function execute(interaction: CommandInteraction) {
    if (!interaction.guildId) {
        return interaction.reply("Something went really, really wrong.");
    }
    const url = interaction.options.getString("link");
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
        return interaction.reply("You are not currently in a voice channel. Join one before using this command.");
    }

    const audioplayer = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const download = ytdl(url, { filter: 'audioonly' });
    const writestream = fs.createWriteStream('audio.mp4');
    const pathtoresource = join('audio.mp4');
    // console.log(pathtoresource);

    download.pipe(writestream);

    const resource = createAudioResource(pathtoresource, {
        inlineVolume: true,
        metadata: {
            title: "SONG",
        },
    });

    audioplayer.play(resource);
    connection.subscribe(audioplayer);

    return interaction.reply(`Playing from: ${url}`);
}
