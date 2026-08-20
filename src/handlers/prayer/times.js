const { EmbedBuilder } = require("discord.js");
const { getPrayerTimes } = require("../../services/prayerService");
const { getCurrentDate } = require("../../utils/dateTime");
const { getLocationByPlaceId } = require("../../services/locationService");
const {
  BRAND_COLOR,
  BRAND_ICON,
  createBrandFooter,
} = require("../../config/brand");

const PRAYERS = [
  { key: "Fajr", name: "Fajr", emoji: "🌅" },
  { key: "Dhuhr", name: "Dhuhr", emoji: "☀️" },
  { key: "Asr", name: "Asr", emoji: "🌤️" },
  { key: "Maghrib", name: "Maghrib", emoji: "🌇" },
  { key: "Isha", name: "Isha", emoji: "🌙" },
];

async function executeTimes(interaction) {
  const placeId = interaction.options.getString("location");

  await interaction.deferReply();

  try {
    const location = await getLocationByPlaceId(placeId);
    const data = await getPrayerTimes(location, getCurrentDate());

    const prayerFields = PRAYERS.map(({ key, name, emoji }) => ({
      name: `${emoji}  ${name}`,
      value: `\`${data.prayers[key]}\``,
      inline: true,
    }));

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🕌 Prayer Times")
      .setThumbnail(BRAND_ICON)
      .setDescription(
        `📍 **${data.location}**\n` + `📅 ${data.date}  •  🌐 ${data.timezone}`,
      )
      .addFields(...prayerFields)
      .setFooter(createBrandFooter("SAJDA • Islamic Discord Assistant"))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching prayer times:", error);

    await interaction.editReply({
      content: "Failed to fetch prayer times for that location.",
    });
  }
}

module.exports = {
  executeTimes,
};
