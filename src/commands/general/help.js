const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about the available commands."),

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor("#00BB97")
      .setTitle("COMMAND LIST")
      .setDescription("Here are the available commands:")
      .addFields({
        name: "GENERAL",
        value: [
          "`/about` - Provides information about the bot.",
          "`/help` - Provides information about the available commands.",
          "`/ping` - Tests the bot latency.",
          "`/salam` - Greets with a salam.",
        ].join("\n"),
      })
      .setFooter({
        text: "SAJDA • Islamic Discord Assistant",
        iconURL: "https://imgur.com/LGjFKad.jpg",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};
