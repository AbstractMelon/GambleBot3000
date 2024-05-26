import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { subtractBalance, addBalance, getBalance } from '../utils/currency';

export const data = new SlashCommandBuilder()
  .setName('slots')
  .setDescription('Play a slot machine game')
  .addIntegerOption(option =>
    option.setName('amount')
      .setDescription('Amount of coins to gamble')
      .setRequired(true)
  );

const slotItems = ["🍎", "🍌", "🍒", "🍇", "🍉"];

const getRandomSlot = (): string => {
  return slotItems[Math.floor(Math.random() * slotItems.length)];
};

const createSlotEmbed = (slots: string[]): EmbedBuilder => {
  return new EmbedBuilder()
    .setTitle('Slot Machine')
    .setDescription(`| ${slots[0]} | ${slots[1]} | ${slots[2]} |`)
    .setColor('Green');
};

export async function execute(interaction: CommandInteraction) {
  const userId = interaction.user.id;
  const betAmount = interaction.options.getInteger('amount', true);
  const userBalance = getBalance(userId);

  if (userBalance < betAmount) {
    await interaction.reply('You do not have enough coins to place this bet.');
    return;
  }

  const slots = [getRandomSlot(), getRandomSlot(), getRandomSlot()];

  let embed = createSlotEmbed(slots);
  await interaction.reply({ embeds: [embed]});

  for (let j = 0; j < 3; j++) {
    slots[j] = getRandomSlot();
    embed = createSlotEmbed(slots);
    await interaction.editReply({ embeds: [embed] });
    await new Promise(resolve => setTimeout(resolve, 50)); 
  }

  // Final result
  embed = createSlotEmbed(slots);
  let result = `| ${slots[0]} | ${slots[1]} | ${slots[2]} |\n`;

  if (slots[0] === slots[1] && slots[1] === slots[2]) {
    result += "# Congratulations! You won!";
    addBalance(userId, betAmount * 10);
  } else if ((slots[0] === slots[1]) || (slots[1] === slots[2]) || (slots[0] === slots[2])) {
    result += "Congratulations! You won back double of your bet.";
    addBalance(userId, Math.floor(betAmount * 2));
  } else {
    result += "Better luck next time!";
    subtractBalance(userId, betAmount);
  }

  embed.setDescription(result);

  await interaction.editReply({ embeds: [embed] });
}
