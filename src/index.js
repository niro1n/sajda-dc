require("dotenv").config();

const path = require("node:path");
const { getCommandFiles } = require("./utils/commandLoader");

const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFiles = getCommandFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);

    console.log(`Loaded command: /${command.data.name}`);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  c.user.setPresence({
    activities: [
      {
        name: "/help - Your prayer times",
        type: 3,
      },
    ],
    status: "online",
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`Command /${interaction.commandName} not found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing /${interaction.commandName}:`, error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "An error occurred while executing the command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "An error occurred while executing the command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.Error, (error) => {
  console.error("The client encountered an error:", error);
});

client.login(process.env.DISCORD_TOKEN);
