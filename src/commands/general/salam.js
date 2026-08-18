const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("salam")
    .setDescription("Greets with a salam"),

  async execute(interaction) {
    await interaction.reply({
      content: `Waalaikumussalam Warahmatullahi Wabarakaatuh! How are you, ${interaction.user}?`,
    });
  },
};
