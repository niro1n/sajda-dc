const { EmbedBuilder } = require("discord.js");
const { getPrayerTimes } = require("../../services/prayerService");
const { getCurrentDate } = require("../../utils/dateTime");

async function executeTimes(interaction) {
  const location = interaction.options.getString("location");

  await interaction.deferReply();

  try {
    const data = await getPrayerTimes(location, getCurrentDate());

    const prayerSchedule = [
      `🌅 **Fajr** — \`${data.prayers.Fajr}\``,
      `☀️ **Dhuhr** — \`${data.prayers.Dhuhr}\``,
      `🌤️ **Asr** — \`${data.prayers.Asr}\``,
      `🌇 **Maghrib** — \`${data.prayers.Maghrib}\``,
      `🌙 **Isha** — \`${data.prayers.Isha}\``,
    ].join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`Prayer Times for ${data.location}`)
      .setColor("#00BB97")
      .setDescription(`Date: ${data.date} | Timezone: ${data.timezone}`)
      .addFields({ name: "Daily Schedule", value: prayerSchedule })
      .setFooter({
        text: "SAJDA • Islamic Discord Assistant",
        iconURL: "https://imgur.com/LGjFKad.jpg",
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    await interaction.editReply("Failed to fetch prayer times.");
  }
}

module.exports = {
  executeTimes,
};
