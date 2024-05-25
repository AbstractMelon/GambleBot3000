import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('roulette')
  .setDescription('Play a roulette game')
  .addStringOption(option =>
    option.setName('color')
      .setDescription('Choose a color to bet on')
      .setRequired(true)
      .addChoices(
        { name: 'Black', value: 'black' },
        { name: 'Red', value: 'red' }
      )
  );

const getRouletteResult = (): { number: number, color: string } => {
  const number = Math.floor(Math.random() * 37);
  let color: string;
  
  if (number === 0) {
    color = 'green';
  } else if (number % 2 === 0) {
    color = 'black';
  } else {
    color = 'red';
  }

  return { number, color };
};

const createRouletteEmbed = (description: string): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle('Roulette Game')
    .setDescription(description || 'Spinning the wheel...')
    .setColor('Random')
    .setTimestamp();
};

const createResultEmbed = (result: { number: number, color: string }, betColor: string): EmbedBuilder => {
  const colorMap: { [key: string]: number } = {
    green: 0x00FF00, 
    red: 0xFF0000, 
    black: 0x000000 
  };

  const embed = new EmbedBuilder()
    .setTitle('Roulette Result')
    .setDescription(`The ball landed on **${result.number} (${result.color})**!\n\nYou bet on **${betColor}**.`)
    .setColor(colorMap[result.color])
    .setTimestamp();

  if (result.color === betColor) {
    embed.addFields({ name: 'Result', value: 'Congratulations! You won!' });
  } else {
    embed.addFields({ name: 'Result', value: 'Better luck next time!' });
  }

  return embed;
};

export async function execute(interaction: CommandInteraction) {
  const betColor = interaction.options.getString('color', true);

  const slotItems = [':black_large_square:', ':red_square:'];
  let scroll = '';

  let embed = createRouletteEmbed(scroll);
  await interaction.reply({ embeds: [embed] , ephemeral: true});

  for (let i = 0; i < 10; i++) {
    scroll += slotItems[i % 2];
    embed = createRouletteEmbed(scroll);
    await interaction.editReply({ embeds: [embed] });
    await new Promise(resolve => setTimeout(resolve, 500)); 
  }

  const result = getRouletteResult();
  const finalEmbed = createResultEmbed(result, betColor);
  await interaction.editReply({ embeds: [finalEmbed] });
}
