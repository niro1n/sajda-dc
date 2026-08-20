const axios = require("axios");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const NOMINATIM_LOOKUP_URL = "https://nominatim.openstreetmap.org/lookup";

const HEADERS = {
  "User-Agent": "SAJDA - Islamic Discord Assistant",
};

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
      headers: HEADERS,
      timeout: 5000,
    });

    return response.data.map((location) => ({
      placeId: String(location.place_id),
      osmType: location.osm_type,
      osmId: String(location.osm_id),
      displayName: location.display_name,
      lat: Number(location.lat),
      lon: Number(location.lon),
    }));
  } catch (error) {
    console.error("Error searching for location:", error.message);

    return [];
  }
}

async function getLocationByPlaceId(placeId) {
  try {
    const osmId = placeId.match(/^[nwr]\d+$/i)?.[0];

    if (!osmId) {
      throw new Error("Invalid location identifier");
    }

    const response = await axios.get(NOMINATIM_LOOKUP_URL, {
      params: {
        osm_ids: osmId.toUpperCase(),
        format: "json",
        addressdetails: 1,
      },
      headers: HEADERS,
      timeout: 5000,
    });

    const location = response.data[0];

    if (!location) {
      throw new Error("Location not found");
    }

    return {
      placeId: String(location.place_id),
      osmType: location.osm_type,
      osmId: String(location.osm_id),
      displayName: location.display_name,
      lat: Number(location.lat),
      lon: Number(location.lon),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve location: ${error.message}`);
  }
}

module.exports = {
  searchLocations,
  getLocationByPlaceId,
};
