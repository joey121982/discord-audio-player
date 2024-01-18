import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("time")
    .setDescription("Returns current time in Romania.");

export async function execute(interaction: CommandInteraction) {
    let reply: string = "Current time in Romania is: ";
    let date = new Date();
    reply += date.toLocaleTimeString();
    return interaction.reply(reply);
}