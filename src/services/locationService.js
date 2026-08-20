const axios = require("axios");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

async function searchLocations(query) {
  const searchQuery = query.trim();

  if (!searchQuery || searchQuery.length < 2) {
    return [];
  }

  try {
    const response = await axios.get(NOMINATIM_URL, {
      params: {
        q: searchQuery,
        format: "json",
        addressdetails: 1,
        limit: 10,
        "accept-language": "id,en",
        featuretype: "settlement",
      },
      headers: {
        "User-Agent": "SAJDA - Islamic Discord Assistant",
      },
      timeout: 5000,
    });

    return response.data.map((location) => ({
      displayName: location.display_name,
      lat: Number(location.lat),
      lon: Number(location.lon),
    }));
  } catch (error) {
    console.error("Error searching for location:", error.message);
    return [];
  }
}

module.exports = {
  searchLocations,
};
