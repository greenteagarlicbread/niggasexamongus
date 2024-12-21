// Required imports
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const express = require('express');

// Array to hold multiple bot instances and their configurations
const bots = [
  {
    token: process.env.TOKEN_1,
    statusMessages: [
      '🧐 Watching out for spawns!',
      '💖 Made by Roti with love',
      '🫳 Remember to touch grass!',
      '👨‍👩‍👧‍👦 Ballsdex isnt everything.',
    ],
  },
  {
    token: process.env.TOKEN_2,
    statusMessages: ['🫡 Serving the SFB'],
  },
  {
    token: process.env.TOKEN_3,
    statusMessages: [
      '❄️ Merry Christmas SFB!',
      '🎁 Run /candy daily!',
    ],
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
    const currentStatusMessage = botConfig.statusMessages[currentStatusIndex];
    client.user.setPresence({
      activities: [{ name: currentStatusMessage }],
      status: botConfig.status, // Set status (e.g., 'online', 'idle', 'dnd')
    });
    console.log(`Updated status to: "${currentStatusMessage}" with status: ${botConfig.status}`);
    currentStatusIndex = (currentStatusIndex + 1) % botConfig.statusMessages.length;
  }

  client.once('ready', () => {
    console.log(`Bot ready: ${client.user.tag}`);
    updateStatus();
    setInterval(updateStatus, 10000); // Rotate status every 10 seconds
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
