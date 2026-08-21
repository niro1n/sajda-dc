const { EmbedBuilder } = require("discord.js");
const { getPrayerTimes } = require("../../services/prayerService");
const { getRandomContent } = require("../../services/contentService");
const { getCurrentDate } = require("../../utils/dateTime");
const { getLocationByPlaceId } = require("../../services/locationService");

const {
  BRAND_COLOR,
  BRAND_ICON,
  createBrandFooter,
} = require("../../config/brand");

const PRAYERS = [
  { key: "Fajr", name: "FAJR", emoji: "🌅" },
  { key: "Dhuhr", name: "DHUHR", emoji: "☀️" },
  { key: "Asr", name: "ASR", emoji: "🌤️" },
  { key: "Maghrib", name: "MAGHRIB", emoji: "🌇" },
  { key: "Isha", name: "ISHA", emoji: "🌙" },
];

async function executeTimes(interaction) {
  const placeId = interaction.options.getString("location");

  await interaction.deferReply();

  try {
    const location = await getLocationByPlaceId(placeId);
    const [data, content] = await Promise.all([
      getPrayerTimes(location, getCurrentDate()),
      getRandomContent(),
    ]);

    const prayerSchedule = PRAYERS.map(
      ({ key, name, emoji }) =>
        `${emoji}  **${name}**  \`${data.prayers[key]}\``,
    ).join("\n");

    const contentText = content.reference
      ? `> ${content.content}\n> — **${content.source}**, ${content.reference}`
      : `> ${content.content}\n> — **${content.source}**`;

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🕌 PRAYER TIMES")
      .setThumbnail(BRAND_ICON)
      .setDescription(
        `📍 **${data.location}**\n` + `📅 ${data.date}  •  🌐 ${data.timezone}`,
      )
      .addFields(
        {
          name: "PRAYER SCHEDULE",
          value: prayerSchedule,
          inline: false,
        },
        {
          name: "ISLAMIC REMINDER",
          value: contentText,
          inline: false,
        },
      )
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
