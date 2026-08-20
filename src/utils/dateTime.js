function getCurrentDate() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${day}-${month}-${year}`;
}

function getCurrentDateTime(timezone) {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  const get = (type) => parts.find((part) => part.type === type).value;

  return {
    date: `${get("day")}-${get("month")}-${get("year")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

module.exports = {
  getCurrentDate,
  getCurrentDateTime,
};
