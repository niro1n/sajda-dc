const { EmbedBuilder } = require("discord.js");
const { getPrayerTimes } = require("../../services/prayerService");
const { getCurrentDate, getCurrentDateTime } = require("../../utils/dateTime");
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

function findNextPrayer(prayers, currentTime) {
  const currentMinutes = currentTime.hour * 60 + currentTime.minute;

  for (const prayer of PRAYERS) {
    const [hour, minute] = prayers[prayer.key].split(":").map(Number);
    const prayerMinutes = hour * 60 + minute;

    if (prayerMinutes > currentMinutes) {
      return { ...prayer, time: prayers[prayer.key], isTomorrow: false };
    }
  }

  return { ...PRAYERS[0], time: prayers[PRAYERS[0].key], isTomorrow: true };
}

function getMinutesUntilPrayer(prayerTime, currentTime, isTomorrow) {
  const [hour, minute] = prayerTime.split(":").map(Number);
  const prayerMinutes = hour * 60 + minute;
  const currentMinutes = currentTime.hour * 60 + currentTime.minute;

  if (isTomorrow) {
    return 24 * 60 - currentMinutes + prayerMinutes;
  }

  return prayerMinutes - currentMinutes;
}

function formatRemainingTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours} hours ${minutes} minutes`;
}

async function executeNext(interaction) {
  const placeId = interaction.options.getString("location");
  const location = await getLocationByPlaceId(placeId);

  await interaction.deferReply();

  try {
    const data = await getPrayerTimes(location, getCurrentDate());
    const currentTime = getCurrentDateTime(data.timezone);
    const nextPrayer = findNextPrayer(data.prayers, currentTime);

    const minutesRemaining = getMinutesUntilPrayer(
      nextPrayer.time,
      currentTime,
      nextPrayer.isTomorrow,
    );

    const remaining = formatRemainingTime(minutesRemaining);
    const dayLabel = nextPrayer.isTomorrow ? "Tomorrow" : "Today";

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🕌 Next Prayer")
      .setThumbnail(BRAND_ICON)
      .setDescription(
        `📍 **${data.location}**\n` +
          `📅 ${dayLabel}, ${currentTime.date}  •  🌐 ${data.timezone}`,
      )
      .addFields({
        name: `${nextPrayer.emoji}  ${nextPrayer.name}`,
        value: `\`${nextPrayer.time}\`\n⏳ in ${remaining}`,
        inline: false,
      })
      .setFooter(createBrandFooter("SAJDA • Islamic Discord Assistant"))
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching next prayer time:", error);

    await interaction.editReply({
      content: "Failed to fetch next prayer time.",
    });
  }
}

module.exports = {
  executeNext,
};
