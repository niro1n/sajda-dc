const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { searchLocations } = require("../../services/locationService");
const { executeTimes } = require("../../handlers/prayer/times");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prayer")
    .setDescription("Prayer time commands")

    // subcommand: /prayer times
    .addSubcommand((subcommand) =>
      subcommand
        .setName("times")
        .setDescription("Displays today's prayer times.")
        .addStringOption((option) =>
          option
            .setName("location")
            .setDescription("Search for a location (e.g., city, country)")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    ),

  async autocomplete(interaction) {
    const query = interaction.options.getFocused();

    if (!query || query.trim().length < 2) {
      return await interaction.respond([]);
    }

    try {
      const locations = await searchLocations(query);

      const choices = (locations || [])
        .filter((loc) => loc && loc.displayName)
        .slice(0, 25)
        .map((location) => ({
          name: location.displayName.slice(0, 100),
          value: location.displayName.slice(0, 100),
        }));

      await interaction.respond(choices);
    } catch (error) {
      console.error("Error in autocomplete:", error);
      await interaction.respond([]);
    }
  },

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    // subcommand: /prayer times
    if (subcommand === "times") {
      return executeTimes(interaction);
    }
  },
};
