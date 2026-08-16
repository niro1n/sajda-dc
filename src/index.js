require("dotenv").config();

const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

clien.on(Events.Error, (error) => {
  console.error("The client encountered an error:", error);
});

client.login(process.env.DISCORD_TOKEN);
