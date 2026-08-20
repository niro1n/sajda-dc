const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const {
  BRAND_COLOR,
  BRAND_ICON,
  createBrandFooter,
} = require("../../config/brand");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Provides information about the bot."),

  async execute(interaction) {
    const aboutEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("ABOUT SAJDA")
      .setThumbnail(BRAND_ICON)
      .setDescription(
        "A modern Islamic assistant built for Discord communities, providing useful and meaningful tools for everyday community life.",
      )
      .addFields({
        name: "OUR FOCUS",
        value:
          "Prayer & Worship\nTools to help communities stay connected with their daily prayers and worship.",
      })
      .addFields(
        { name: "VERSION", value: "1.0.0", inline: true },
        { name: "DEVELOPER", value: "Niro", inline: true },
      )
      .setFooter(createBrandFooter("SAJDA - Islamic Discord Assistant"))
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("INVITE")
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=1538588949705003038&permissions=8&scope=bot%20applications.commands",
        ),

      new ButtonBuilder()
        .setLabel("SUPPORT")
        .setStyle(ButtonStyle.Link)
        .setURL("https://kreate.gg/niroin"),
    );

    await interaction.reply({ embeds: [aboutEmbed], components: [row] });
  },
};
