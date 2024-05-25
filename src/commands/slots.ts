import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('slots')
  .setDescription('Play a slot machine game');

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
    const slots = [getRandomSlot(), getRandomSlot(), getRandomSlot()];

    let embed = createSlotEmbed(slots);
    await interaction.reply({ embeds: [embed], ephemeral: true});

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
    result += "# Congratulations! You won! @everyone";
  } else {
    result += "Better luck next time!";
  }

  embed.setDescription(result);

  await interaction.editReply({ embeds: [embed] });
}
