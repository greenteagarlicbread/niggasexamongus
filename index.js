// Required imports
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

// Array to hold multiple bot instances and their configurations
const bots = [
  {
    token: process.env.TOKEN_1,
    statusMessages: ["🧐 Watching out for spawns!", "💖 Made by Roti with love"],
    statusTypes: ['online'],
  },
  {
    token: process.env.TOKEN_2,
    statusMessages: ["🫡 Serving the SFB"],
    statusTypes: ['online'],
  },
  {
    token: process.env.TOKEN_3,
    statusMessages: ["❄️ Merry Christmas everyone!", "🎁 Run /candy daily!"],
    statusTypes: ['online'],
  },
];

// Function to log in and set up status for each bot
async function loginAndSetupBot(botConfig) {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  let currentStatusIndex = 0;

  async function login() {
    try {
      await client.login(botConfig.token);
      console.log(`Logged in as: ${client.user.tag}`);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  function updateStatus() {
    const currentStatus = botConfig.statusMessages[currentStatusIndex];
    client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.Playing }],
      status: botConfig.statusTypes[0],
    });
    currentStatusIndex = (currentStatusIndex + 1) % botConfig.statusMessages.length;
  }

  client.once('ready', () => {
    console.log(`Bot ready: ${client.user.tag}`);
    updateStatus();
    setInterval(updateStatus, 10000);
  });

  await login();
}

// Start the bots
(async () => {
  for (const botConfig of bots) {
    await loginAndSetupBot(botConfig);
  }
})();

// Express server setup
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Discord bot is running!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
