const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: '../.env' }); // Ensure the correct path to your .env file
const express = require('express');
const DiscordKey = process.env.DISCORD_KEY;

console.log('discordKey:', DiscordKey);
console.log('Starting Discord bot...');

if (!DiscordKey) {
    console.error('DISCORD_KEY is not defined in .env file');
    process.exit(1);
} else {
    console.log('DISCORD_KEY successfully loaded from .env file');
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,              // To receive events related to guilds
        GatewayIntentBits.GuildMessages,       // To receive events related to messages in guilds
        GatewayIntentBits.MessageContent,      // To read the content of messages
        GatewayIntentBits.GuildMembers         // To receive events related to guild members
    ]
});

console.log('Discord client created with intents:', client.options.intents);

// Log when the bot is ready
client.once('ready', () => {
    console.log('Discord bot is ready');

    // Send a test DM to a specified user ID
    const testUserId = '456897813515730965'; // Replace with your Discord user ID
    const testMessage = 'This is a test message from your Discord bot!';
    sendDiscordNotification(testMessage, testUserId);
});

// Function to send a direct message to a user
async function sendDiscordNotification(message, userId) {
    console.log(`Preparing to send message to user ${userId}`);
    try {
        const user = await client.users.fetch(userId);
        console.log('Fetched user:', user);
        if (user) {
            await user.send(message);
            console.log(`Message sent to user ${userId}`);
        } else {
            console.error('User not found');
        }
    } catch (error) {
        console.error('Error sending DM:', error);
    }
}

// Log in to Discord with your bot token
client.login(DiscordKey).then(() => {
    console.log('Logged in to Discord successfully');
}).catch(err => {
    console.error('Error logging in to Discord:', err);
});

module.exports = sendDiscordNotification;
