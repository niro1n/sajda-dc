const { EmbedBuilder } = require("discord.js");
const { getPrayerTimes } = require("../../services/prayerService");
const { getRandomContent } = require("../../services/contentService");
const { getCurrentDate, getCurrentDateTime } = require("../../utils/dateTime");
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

function findNextPrayer(prayers, currentTime) {
  const currentMinutes = currentTime.hour * 60 + currentTime.minute;

  for (const prayer of PRAYERS) {
    const [hour, minute] = prayers[prayer.key].split(":").map(Number);
    const prayerMinutes = hour * 60 + minute;

    if (prayerMinutes > currentMinutes) {
      return {
        ...prayer,
        time: prayers[prayer.key],
        isTomorrow: false,
      };
    }
  }

  return {
    ...PRAYERS[0],
    time: prayers[PRAYERS[0].key],
    isTomorrow: true,
  };
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

  if (hours === 0) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  }

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  const hourText = hours === 1 ? "hour" : "hours";
  const minuteText = minutes === 1 ? "minute" : "minutes";

  return `${hours} ${hourText} ${minutes} ${minuteText}`;
}

async function executeNext(interaction) {
  const placeId = interaction.options.getString("location");

  await interaction.deferReply();

  try {
    const location = await getLocationByPlaceId(placeId);
    const [data, content] = await Promise.all([
      getPrayerTimes(location, getCurrentDate()),
      getRandomContent(),
    ]);
    const currentTime = getCurrentDateTime(data.timezone);
    const nextPrayer = findNextPrayer(data.prayers, currentTime);

    const minutesRemaining = getMinutesUntilPrayer(
      nextPrayer.time,
      currentTime,
      nextPrayer.isTomorrow,
    );
    const remaining = formatRemainingTime(minutesRemaining);

    const contentText = content.reference
      ? `> ${content.content}\n> — **${content.source}**, ${content.reference}`
      : `> ${content.content}\n> — **${content.source}**`;

    const dateLabel = nextPrayer.isTomorrow
      ? `Tomorrow, ${currentTime.date}`
      : currentTime.date;

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🕌 NEXT PRAYER")
      .setThumbnail(BRAND_ICON)
      .setDescription(
        `📍 **${data.location}**\n` + `📅 ${dateLabel}  •  🌐 ${data.timezone}`,
      )
      .addFields(
        {
          name: `${nextPrayer.emoji}  ${nextPrayer.name}`,
          value: `\`${nextPrayer.time}\`\n⏳ \`${remaining}\``,
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

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error("Error fetching next prayer time:", error);

    await interaction.editReply({
      content: "Failed to fetch next prayer time for that location.",
    });
  }
}

module.exports = {
  executeNext,
};
