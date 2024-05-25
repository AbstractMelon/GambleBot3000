import { Client } from "discord.js";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./DeployCommands";


const guildId = "1243646222338625587";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

client.on('ready', () => {  
    console.log(`Logged in as ${client.user?.tag ?? 'Unknown user'}`);
    client.guilds.cache.forEach(guild=>{
      deployCommands({ guildId:guild.id });
    })
});


client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }
  
    const { commandName } = interaction;
    console.log(`Command "${commandName}" used by ${interaction.user.tag}`);
  
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  });
  

client.login(config.DISCORD_TOKEN);
