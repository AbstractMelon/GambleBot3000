import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { addBalance, subtractBalance, getBalance, multiplyBalance, divideBalance, increaseBalanceByPercentage, decreaseBalanceByPercentage, setBalance } from '../utils/currency';

export const data = new SlashCommandBuilder()
  .setName('spin')
  .setDescription('Spin the Wheel of Fortune!');

export async function execute(interaction: CommandInteraction) {
  const wheelSlices = [
    { prize: '1000 coins', win: true },
    { prize: '2000 coins', win: true },
    { prize: '5000 coins', win: true },
    { prize: '-1000 coins', win: false },
    { prize: 'Bankrupt', win: false },
    { prize: '-500', win: false },
    { prize: 'Multiply by 2', win: true },
    { prize: 'Divide by 2', win: true },
    { prize: 'Increase by 10%', win: true },
    { prize: 'Decrease by 10%', win: false },
    { prize: 'Set to 10000 coins', win: true },
  ];

  function spinWheel(): { prize: string, win: boolean } {
    const randomIndex = Math.floor(Math.random() * wheelSlices.length);
    return wheelSlices[randomIndex];
  }

  const result = spinWheel();

  const userId = interaction.user.id;
  const userBalance = getBalance(userId);

  let replyText = '';

  switch (result.prize) {
    case 'Bankrupt':
      subtractBalance(userId, userBalance);
      replyText = `Oh no! You went bankrupt. Your balance is now 0 coins.`;
      break;
    case 'Multiply by 2':
      multiplyBalance(userId, 2);
      replyText = `Congratulations! Your balance has been multiplied by 2. Your new balance is ${getBalance(userId)} coins.`;
      break;
    case 'Divide by 2':
      divideBalance(userId, 2);
      replyText = `Congratulations! Your balance has been divided by 2. Your new balance is ${getBalance(userId)} coins.`;
      break;
    case 'Increase by 10%':
      increaseBalanceByPercentage(userId, 10);
      replyText = `Congratulations! Your balance has been increased by 10%. Your new balance is ${getBalance(userId)} coins.`;
      break;
    case 'Decrease by 10%':
      decreaseBalanceByPercentage(userId, 10);
      replyText = `Better luck next time! Your balance has been decreased by 10%. Your new balance is ${getBalance(userId)} coins.`;
      break;
    case 'Set to 10000 coins':
      setBalance(userId, 10000);
      replyText = `Congratulations! Your balance has been set to 10000 coins.`;
      break;
    default:
      const prizeAmount = parseInt(result.prize);
      if (result.win) {
        addBalance(userId, prizeAmount);
        replyText = `Congratulations! You won ${prizeAmount}. Your new balance is ${getBalance(userId)} coins.`;
      } else {
        subtractBalance(userId, Math.abs(prizeAmount));
        replyText = `Better luck next time! You lost ${Math.abs(prizeAmount)} coins. Your new balance is ${getBalance(userId)} coins.`;
      }
  }

  const embed = new EmbedBuilder()
    .setTitle('Wheel of Fortune')
    .setDescription(`You spun the wheel and got: **${result.prize}**\n${replyText}`)
    .setColor(result.win ? 'Green' : 'Red');

  await interaction.reply({ embeds: [embed]});
}