import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getBalance } from '../utils/currency';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('View your current balance');

export async function execute(interaction: CommandInteraction) {
  const userId = interaction.user.id;
  const userBalance = getBalance(userId);

  const embed = new EmbedBuilder()
    .setTitle('Balance')
    .setDescription(`Your current balance is ${userBalance} coins.`)
    .setColor('Green');

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
