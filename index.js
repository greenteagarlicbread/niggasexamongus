const bots = [
  {
    token: process.env.TOKEN_1,
    statusMessages: ["🧐 Watching out for spawns!", "💖 Made by Roti with love"],
    statusTypes: ['idle'],
  },
  {
    token: process.env.TOKEN_2,
    statusMessages: ["🫡 Serving the SFB"],
    statusTypes: ['online'],
  },
  {
    token: process.env.TOKEN_3,
    statusMessages: ["❄️ Merry Christmas SFB!", "🎁 Run /candy daily"],
    statusTypes: ['dnd'],
  },
];

(async () => {
  for (const botConfig of bots) {
    await loginAndSetupBot(botConfig);
  }
})();
