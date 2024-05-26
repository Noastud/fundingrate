// File: backend/discordBot.js
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
  console.log('Discord bot is ready');
});

async function sendDiscordNotification(message) {
  const channel = client.channels.cache.get('YOUR_DISCORD_CHANNEL_ID');
  if (channel) {
    channel.send(message);
  }
}

client.login('YOUR_DISCORD_BOT_TOKEN');

module.exports = sendDiscordNotification;
