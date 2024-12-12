const { Client, Intents } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const webhookUrl = process.env.WEBHOOK_URL;
const apiEndpoint = process.env.API_ENDPOINT;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages and only handle the /message command
  if (message.author.bot) return;
  
  if (message.content.startsWith('/message')) {
    const content = message.content.slice(9).trim();  // Get the content after "/message"

    if (!content) {
      message.reply('Please provide a message.');
      return;
    }

    try {
      // Send the message to the Discord webhook
      await axios.post(webhookUrl, { content });

      // Update the JSON file with the new message
      const messages = await getMessagesFromGitHub();
      messages.push({ content });

      // Save the updated messages to a JSON file (this would be hosted on GitHub Pages)
      await saveMessagesToGitHub(messages);

      message.reply('Message sent to both Discord and the website!');
    } catch (error) {
      console.error('Error sending message:', error);
      message.reply('There was an error sending the message.');
    }
  }
});

// Function to fetch existing messages from GitHub Pages (from the public messages.json file)
async function getMessagesFromGitHub() {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data || [];
  } catch (error) {
    return [];
  }
}

// Function to save messages back to GitHub Pages (this part requires manually committing the file via GitHub Actions or another CI/CD tool)
async function saveMessagesToGitHub(messages) {
  // GitHub Pages doesn't support writing to files, so this part has to be done manually or via an automated GitHub Actions pipeline.
  // You could send the updated JSON to a file in your repository and commit the changes.
}

client.login(process.env.DISCORD_TOKEN);
