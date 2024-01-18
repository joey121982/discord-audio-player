import { Client, Events } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { getVoiceConnections } from '@discordjs/voice';

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildVoiceStates" ],
});

client.once(Events.ClientReady, () => {
    console.log("Discord bot is ready! 🤖");
});

client.on(Events.GuildAvailable, async (guild) => {
    console.log("Loading guild...");
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);

const stopEvent = (code: any) => {
    if (!client.user) {
        client.destroy();
        return;
    }
    client.user.setStatus("invisible");
    const connections = getVoiceConnections();
    connections.forEach(connection => {
        connection.disconnect();
        connection.destroy();
    });
    client.destroy();
}

process.addListener("SIGINT", stopEvent);
process.addListener("SIGTERM", stopEvent);