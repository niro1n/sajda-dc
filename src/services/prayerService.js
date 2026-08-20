const axios = require("axios");

const API_URL = "https://api.aladhan.com/v1/timingsByAddress";

async function getPrayerTimes(address, date) {
  try {
    const response = await axios.get(`${API_URL}/${date}`, {
      params: {
        address: address,
        method: 20,
      },
      timeout: 5000,
    });

    if (response.data.code !== 200) {
      throw new Error("Failed to fetch prayer times");
    }

    const data = response.data.data;

    return {
      location: address,
      date: data.date.readable,
      timezone: data.meta.timezone,
      prayers: {
        Fajr: data.timings.Fajr,
        Dhuhr: data.timings.Dhuhr,
        Asr: data.timings.Asr,
        Maghrib: data.timings.Maghrib,
        Isha: data.timings.Isha,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching prayer times: ${error.message}`);
  }
}

module.exports = {
  getPrayerTimes,
};
