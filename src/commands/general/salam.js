const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("salam")
    .setDescription("Menyapa dengan salam"),

  async execute(interaction) {
    await interaction.reply({
      content: `Waalaikumussalam Warahmatullahi Wabarakaatuh!, Bagaimana kabarmu ${interaction.user}?`,
    });
  },
};
