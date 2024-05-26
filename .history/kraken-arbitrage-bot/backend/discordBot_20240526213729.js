const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once('ready', () => {
  console.log('Discord bot is ready');
});

async function sendDiscordNotification(message) {
  const channel = client.channels.cache.get('YOUR_DISCORD_CHANNEL_ID');
  if (channel) {
    channel.send(message);
  }
}

client.login('MTI0NDM3MzYyMjY4NTA0NDgwOA.Gg62Uz.c3O2YuOd-CUePwR2aPNloaW4Z-TAZQHbGjqYjs');

module.exports = sendDiscordNotification;
