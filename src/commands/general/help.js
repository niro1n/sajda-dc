const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { BRAND_COLOR, createBrandFooter } = require("../../config/brand");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about the available commands."),

  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("COMMAND LIST")
      .setDescription("Here are the available commands:")

      // general commands
      .addFields({
        name: "GENERAL",
        value: [
          "`/about` - Provides information about the bot.",
          "`/help` - Provides information about the available commands.",
          "`/ping` - Tests the bot latency.",
          "`/salam` - Greets with a salam.",
        ].join("\n"),
      })

      // prayer commands
      .addFields({
        name: "PRAYER",
        value: [
          "`/prayer times` - Displays today's prayer times.",
          "`/prayer next` - Displays the next prayer time.",
        ].join("\n"),
      })

      .setFooter(createBrandFooter("SAJDA - Your Prayer Times"))
      .setTimestamp();

    await interaction.reply({
      embeds: [helpEmbed],
    });
  },
};
