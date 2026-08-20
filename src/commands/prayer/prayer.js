const { SlashCommandBuilder } = require("discord.js");
const { searchLocations } = require("../../services/locationService");
const { executeTimes } = require("../../handlers/prayer/times");
const { executeNext } = require("../../handlers/prayer/next");

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
    )

    // subcommand: /prayer next
    .addSubcommand((subcommand) =>
      subcommand
        .setName("next")
        .setDescription("Displays the next prayer time.")
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
      return interaction.respond([]);
    }

    try {
      const locations = await searchLocations(query);

      const choices = locations
        .filter((location) => location?.placeId)
        .slice(0, 25)
        .map((location) => ({
          name: location.displayName.slice(0, 100),
          value: `${location.osmType[0].toUpperCase()}${location.osmId}`,
        }));

      await interaction.respond(choices);
    } catch (error) {
      console.error("Error in prayer autocomplete:", error);

      await interaction.respond([]);
    }
  },

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    // subcommand: /prayer times
    if (subcommand === "times") {
      return executeTimes(interaction);
    }

    // subcommand: /prayer next
    if (subcommand === "next") {
      return executeNext(interaction);
    }
  },
};
