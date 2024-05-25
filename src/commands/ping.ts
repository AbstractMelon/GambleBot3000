import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check bot's latency.");

export async function execute(interaction: CommandInteraction) {
  const sentTimestamp = Date.now();
  const reply = await interaction.reply({ content: "Pinging...", fetchReply: true, ephemeral: true});
  const latency = reply.createdTimestamp - sentTimestamp;
  const apiLatency = interaction.client.ws.ping;

  const embed = new EmbedBuilder()
    .setTitle("Pong!")
    .addField("API Latency", `${apiLatency}ms`, true)
    .addField("Bot Latency", `${latency}ms`, true)
    .setColor("#7289da")
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}
