const axios = require("axios");
const HADITH_URL = "https://randomhadith.com/api";
const QURAN_URL = "https://api.alquran.cloud/v1/ayah/random/en.asad";

async function getRandomHadith() {
  const response = await axios.get(HADITH_URL, { timeout: 5000 });

  const data = response.data;

  if (!data || !data.text_en) {
    throw new Error("Invalid hadith response");
  }

  return {
    type: "hadith",
    content: data.text_en,
    source: data.book,
    reference: data.hadith_no,
  };
}

async function getRandomQuranVerse() {
  const response = await axios.get(QURAN_URL, { timeout: 5000 });

  const data = response.data?.data;

  if (!data || !data.text) {
    throw new Error("Invalid Quran verse response");
  }

  return {
    type: "quran",
    content: data.text,
    source: "Qur'an",
    reference: `${data.surah.englishName} ${data.surah.number}:${data.numberInSurah}`,
  };
}

async function getRandomContent() {
  const contentTypes = ["hadith", "quran"];
  const randomType =
    contentTypes[Math.floor(Math.random() * contentTypes.length)];

  if (randomType === "quran") {
    return getRandomQuranVerse();
  } else {
    return getRandomHadith();
  }
}

module.exports = {
  getRandomContent,
};
