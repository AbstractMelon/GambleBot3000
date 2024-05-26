import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, User } from 'discord.js';
import { getBalance, getExperience, getLevel, getJoinDate } from '../utils/stats';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';

// Register custom font
registerFont('./src/assets/fonts/Roboto-Regular.ttf', { family: 'Roboto' });

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('View user statistics')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('The user to view statistics for')
      .setRequired(false)
  )
  .addBooleanOption(option =>
    option.setName('image')
      .setDescription('Display stats as an image')
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  const targetUser = interaction.options.getUser('user') || interaction.user;
  const userId = targetUser.id;
  const username = targetUser.username;
  const userBalance = getBalance(userId);
  const userExperience = getExperience(userId);
  const userLevel = getLevel(userId);
  const userJoinDate = getJoinDate(userId);

  if (interaction.options.getBoolean('image')) {
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0072ff');
    gradient.addColorStop(1, '#00c6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const userAvatar = await loadImage(targetUser.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(userAvatar, 50, 50, 100, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Roboto';
    ctx.fillText(`User: ${username}`, 180, 100);
    ctx.fillText(`Level: ${userLevel}`, 180, 150);
    ctx.fillText(`Balance: ${userBalance.toLocaleString()} coins`, 180, 200);
    ctx.fillText(`Experience: ${userExperience.toLocaleString()} XP`, 180, 250);
    ctx.fillText(`Join Date: ${userJoinDate.toLocaleDateString()}`, 180, 300);

    drawProgressBar(ctx, 180, 350, userExperience, xpForNextLevel(userLevel), '#00FF00', 'Experience');

    const buffer = canvas.toBuffer();
    fs.writeFileSync('userStats.png', buffer);

    await interaction.reply({ files: ['userStats.png'], ephemeral: true });
  } else {
    const embed = new EmbedBuilder()
      .setTitle('User Statistics')
      .setDescription(`Stats for user **${username}**`)
      .addFields(
        { name: "Level", value: `You are at level **${userLevel}**.` },
        { name: "Balance", value: `Your current balance is **${userBalance.toLocaleString()}** coins.` },
        { name: "Experience", value: `You have **${userExperience.toLocaleString()}** XP.` },
        { name: "Join Date", value: `You joined on **${userJoinDate.toLocaleDateString()}**.` }
      )
      .setColor('#00FF00')
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

const xpForNextLevel = (level: number): number => 100 * level;

const drawProgressBar = (ctx: any, x: number, y: number, value: number, maxValue: number, color: string, label: string) => {
  const progressBarWidth = 300;
  const progressBarHeight = 20;

  // Background
  ctx.fillStyle = '#222222';
  ctx.fillRect(x, y, progressBarWidth, progressBarHeight);

  // Progress
  const progressWidth = (value / maxValue) * progressBarWidth;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, progressWidth, progressBarHeight);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Roboto';
  ctx.fillText(`${label}: ${value} / ${maxValue}`, x + 10, y + progressBarHeight + 25);
};
