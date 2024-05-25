import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('spin')
  .setDescription('Spin the Wheel of Fortune!');

export async function execute(interaction: CommandInteraction) {
  const wheelSlices = [
    { prize: '100 coins', win: true },
    { prize: '200 coins', win: true },
    { prize: '500 coins', win: true },
    { prize: '-1000 coins', win: false },
    { prize: 'Bankrupt', win: false },
    { prize: '-234587239470978', win: false },
  ];

  function spinWheel(): { prize: string, win: boolean } {
    const rand = Math.random();
    const randomIndex = Math.floor(Math.random() * wheelSlices.length);
    return wheelSlices[randomIndex];
  }

  const result = spinWheel();

  const embed = new EmbedBuilder()
    .setTitle('Wheel of Fortune')
    .setDescription(`You spun the wheel and got: **${result.prize}**`)
    .setColor(result.win ? 'Green' : 'Red');

  await interaction.reply({ embeds: [embed] });
}
