import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins the invoker's voice channel.");

export async function execute(interaction: CommandInteraction) {
    const guild = interaction.guild;

    if (!guild) {
        return interaction.reply("Something went really, really wrong.");
    }

    const userGuildid = await guild.members.fetch(interaction.user.id);
    const channel = userGuildid.voice.channel;

    if (!channel) {
        return interaction.reply("You need to be in a voice channel to use this.");
    }

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    if (!connection) {
        return interaction.reply("Failed to connect.");
    }
    return interaction.reply("Connected!");
}