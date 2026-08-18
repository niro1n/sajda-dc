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
      .addFields(
        {
          name: "🌐 - GENERAL",
          value: [
            "`/help` - Provides information about the available commands.",
            "`/ping` - Tests the bot latency.",
            "`/salam` - Greets with a salam.",
          ].join("\n"),
        },
        {
          name: "🕌 - PRAYER",
          value: [
            "`/sajda status` - Displays the current status of SAJDA.",
            "`/sajda times` - Displays prayer times for a specific location.",
          ].join("\n"),
        },
      )
      .setFooter({
        text: "SAJDA - Your Prayer Times",
        iconURL: "https://imgur.com/LGjFKad.jpg",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};
