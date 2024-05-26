import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getBalance, subtractBalance, addBalance } from '../utils/currency';

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
  )
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Amount of coins to gamble')
      .setRequired(true)
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
    .setDescription(description || 'Spinning the wheel... \n :arrow_down:')
    .setColor('Random')
    .setTimestamp();
};

const createResultEmbed = (result: { number: number, color: string }, betColor: string, won: boolean): EmbedBuilder => {
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

  if (won) {
    embed.addFields({ name: 'Result', value: 'Congratulations! You won!' });
  } else {
    embed.addFields({ name: 'Result', value: 'Better luck next time!' });
  }

  return embed;
};

export async function execute(interaction: CommandInteraction) {
  const userId = interaction.user.id;
  const betColor = interaction.options.getString('color', true);
  const betAmount = interaction.options.getInteger('amount', true);

  const userBalance = getBalance(userId);

  if (userBalance < betAmount) {
    await interaction.reply('You do not have enough coins to place this bet.');
    return;
  }

  const slotItems = [':black_large_square:', ':red_square:'];
  let scroll = '';

  let embed = createRouletteEmbed(":arrow_down: Spinning the wheel... \n " + scroll);
  const reply = await interaction.reply({ embeds: [embed] });

  for (let i = 0; i < 10; i++) {
    scroll = '';
    for (let j = 0; j < 10; j++) {
      scroll += slotItems[(i + j) % 2];
    }
    embed = createRouletteEmbed(":arrow_down: Spinning the wheel... \n " + scroll);
    await reply.edit({ embeds: [embed] });
    await new Promise(resolve => setTimeout(resolve, 50)); 
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const result = getRouletteResult();
  const won = result.color === betColor;
  const finalEmbed = createResultEmbed(result, betColor, won);
  await reply.edit({ embeds: [finalEmbed] });

  if (won) {
    addBalance(userId, betAmount);
  } else {
    subtractBalance(userId, betAmount);
  }
}
