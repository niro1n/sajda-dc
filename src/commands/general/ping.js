const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Melakukan test ping bot."),

  async execute(interaction) {
    const pingEmbed = new EmbedBuilder()
      .setColor("#00BB97")
      .setTitle("🏓 - PONG!")
      .setDescription(`Latency: ${Date.now() - interaction.createdTimestamp}ms`)
      .setFooter({
        text: "SAJDA - Your Prayer Times",
        iconURL: "https://imgur.com/LGjFKad.jpg",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [pingEmbed],
    });
  },
};
