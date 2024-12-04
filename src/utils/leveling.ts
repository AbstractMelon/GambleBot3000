import { getUser, updateUser, createUser } from '../database/manager';
import { User } from '../types';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

const xpForNextLevel = (level: number): number => 100 * level;

export const addExperience = (interaction: CommandInteraction, userId: string, amount: number): void => {
  let user = getUser(userId);

  if (!user) {
    user = createUser(userId, 0);
  }

  const prevLevel = user.level;

  user.experience += amount;

  while (user.experience >= xpForNextLevel(user.level)) {
    user.experience -= xpForNextLevel(user.level);
    user.level += 1;

    sendLevelUpMessageInChannel(interaction, user, prevLevel);
    sendLevelUpMessageDirectMessage(interaction, user);
  }

  updateUser(user);
};

const sendLevelUpMessageInChannel = (interaction: CommandInteraction, user: User, prevLevel: number): void => {
  const embed = new EmbedBuilder()
    .setTitle('Level Up!')
    .setDescription(`Congratulations, ${interaction.user.username}! You've leveled up to level ${user.level}!`)
    .setColor('Green');

  interaction.reply({ embeds: [embed] })
    .then(() => console.log(`Level up message sent in channel: ${interaction.channel?.id}`))
    .catch(error => console.error('Error sending level up message:', error));
};

const sendLevelUpMessageDirectMessage = (interaction: CommandInteraction, user: User): void => {
  const embed = new EmbedBuilder()
    .setTitle('Level Up!')
    .setDescription(`Congratulations, ${interaction.user.username}! You've leveled up to level ${user.level}!`)
    .setColor('Green');

  interaction.user.send({ embeds: [embed] })
    .then(() => console.log(`Level up message sent to ${interaction.user.username}`))
    .catch(error => console.error('Error sending level up message:', error));
};
