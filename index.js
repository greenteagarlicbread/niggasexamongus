const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
require('dotenv').config();
const express = require('express');
const path = require('path');

// Array to hold multiple bot instances and their configurations
const bots = [
  {
    token: process.env.TOKEN_1, // Token for Bot 1
    statusMessages: ["🧐 Watching out for spawns!", "💖 Made by Roti with love", "🫳 Remember to touch grass!", "👨‍👩‍👧‍👦 Ballsdex isn't everything."],
    statusTypes: ['idle'],
  },
  {
    token: process.env.TOKEN_2, // Token for Bot 2
    statusMessages: ["🫡 Serving the SFB"],
    statusTypes: ['online'],
  },
  {
    token: process.env.TOKEN_3, // Token for Bot 3
    statusMessages: ["❄️ Merry Christmas!"],
    statusTypes: ['online'],
  // Add more bots as needed
];

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});

app.listen(port, () => {
  console.log('\x1b[36m[ SERVER ]\x1b[0m', '\x1b[32m SH : http://localhost:' + port + ' ✅\x1b[0m');
});

// Function to log in and set up status for each bot
async function loginAndSetupBot(botConfig) {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  let currentStatusIndex = 0;
  let currentTypeIndex = 0;

  async function login() {
    try {
      await client.login(botConfig.token);
      console.log('\x1b[36m[ LOGIN ]\x1b[0m', `\x1b[32mLogged in as: ${client.user.tag} ✅\x1b[0m`);
      console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[35mBot ID: ${client.user.id} \x1b[0m`);
      console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mConnected to ${client.guilds.cache.size} server(s) \x1b[0m`);
    } catch (error) {
      console.error('\x1b[31m[ ERROR ]\x1b[0m', 'Failed to log in:', error);
      process.exit(1);
    }
  }

  function updateStatus() {
    const currentStatus = botConfig.statusMessages[currentStatusIndex];
    const currentType = botConfig.statusTypes[currentTypeIndex];
    client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.Custom }],
      status: currentType,
    });
    console.log('\x1b[33m[ STATUS ]\x1b[0m', `Updated status to: ${currentStatus} (${currentType})`);
    currentStatusIndex = (currentStatusIndex + 1) % botConfig.statusMessages.length;
    currentTypeIndex = (currentTypeIndex + 1) % botConfig.statusTypes.length;
  }

  function heartbeat() {
    setInterval(() => {
      console.log('\x1b[35m[ HEARTBEAT ]\x1b[0m', `Bot is alive at ${new Date().toLocaleTimeString()}`);
    }, 30000);
  }

  client.once('ready', () => {
    console.log('\x1b[36m[ INFO ]\x1b[0m', `\x1b[34mPing: ${client.ws.ping} ms \x1b[0m`);
    updateStatus();
    setInterval(updateStatus, 10000);
    heartbeat();
  });

  await login();
}

// Loop through each bot configuration and set them up
bots.forEach(botConfig => {
  loginAndSetupBot(botConfig);
});
