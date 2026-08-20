const { getPrayerTimes } = require("../../services/prayerService");

describe("Prayer Service", () => {
  it("should retrieve prayer times successfullly", async () => {
    const data = await getPrayerTimes(
      "Denpasar, Bali, Indonesia",
      "19-08-2026",
    );

    expect(data).toBeDefined();

    expect(data.location).toBe("Denpasar, Bali, Indonesia");

    expect(data.date).toBeDefined();
    expect(data.timezone).toBeDefined();

    expect(data.prayers).toBeDefined();

    expect(data.prayers.Fajr).toBeDefined();
    expect(data.prayers.Dhuhr).toBeDefined();
    expect(data.prayers.Asr).toBeDefined();
    expect(data.prayers.Maghrib).toBeDefined();
    expect(data.prayers.Isha).toBeDefined();
  });
});
