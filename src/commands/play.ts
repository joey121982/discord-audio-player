import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";
import play from "play-dl";

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
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    let stream = await play.stream(url);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    audioplayer.play(resource);
    connection.subscribe(audioplayer);

    return interaction.reply(`Playing from: ${url}`);
}
