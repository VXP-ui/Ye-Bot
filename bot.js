const { Client, Intents } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const webhookUrl = process.env.WEBHOOK_URL;
const apiEndpoint = process.env.API_ENDPOINT;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check for the /message command
  if (message.content.startsWith('/message')) {
    const content = message.content.slice(9).trim();  // Extract the message after /message

    if (!content) {
      message.reply('Please provide a message to send.');
      return;
    }

    try {
      // Send the message to the website API
      await axios.post(apiEndpoint, { content });

      // Send the message to the Discord webhook
      await axios.post(webhookUrl, { content });

      message.reply('Message sent to both the website and the Discord channel!');
    } catch (error) {
      console.error('Error sending message:', error);
      message.reply('Failed to send message.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
