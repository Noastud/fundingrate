const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Log when the bot is ready
client.once('ready', () => {
  console.log('Discord bot is ready');
});

// Function to send a direct message to a user
async function sendDiscordNotification(message, userId) {
  try {
    const user = await client.users.fetch(userId);
    if (user) {
      await user.send(message);
    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error sending DM:', error);
  }
}

// Log in to Discord with your bot token


client.login('MTI0NDM3MzYyMjY4NTA0NDgwOA.Gg62Uz.c3O2YuOd-CUePwR2aPNloaW4Z-TAZQHbGjqYjs');

module.exports = sendDiscordNotification;
