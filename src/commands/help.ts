import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get information about the available commands');

const createHelpEmbed = (): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle('Help - Available Commands')
    .setDescription('Here is a list of available commands:')
    .addFields(
      { name: '/balance', value: 'Check your current coin balance.', inline: false },
      { name: '/stats', value: 'View your game statistics.', inline: false },
      { name: '/roulette', value: 'Play a roulette game. Bet on a color and try your luck.', inline: false },
      { name: '/slots', value: 'Play a slot machine game. Gamble an amount and see if you win.', inline: false },
      { name: '/spin', value: 'Spin the Wheel of Fortune! Try your luck and win coins.', inline: false }
    )
    .setColor('Blue')
    .setTimestamp();
};

export async function execute(interaction: CommandInteraction) {
  const embed = createHelpEmbed();
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
