import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves current voice channel.");

export async function execute(interaction: CommandInteraction) {
    if(!interaction.guildId) {
        return interaction.reply("Something went really, really wrong.");
    }
    const connection = getVoiceConnection(interaction.guildId);

    if(!connection) {
        return interaction.reply("You are not currently in a voice channel.");
    }

    connection.disconnect();
    connection.destroy();

    return interaction.reply("Left the voice channel.");
}