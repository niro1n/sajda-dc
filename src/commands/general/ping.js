const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { BRAND_COLOR, createBrandFooter } = require("../../config/brand");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Tests the bot latency."),

  async execute(interaction) {
    const pingEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🏓 - PONG!")
      .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms`)
      .setFooter(createBrandFooter("SAJDA - Your Prayer Times"))
      .setTimestamp();

    await interaction.reply({
      embeds: [pingEmbed],
    });
  },
};
