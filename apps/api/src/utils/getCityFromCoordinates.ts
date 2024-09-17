import axios from 'axios';

export default async function getCityFromCoordinates(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: `${latitude},${longitude}`,
          key: process.env.OPENCAGE_API_KEY,
        },
      },
    );

    const results = response.data.results;
    if (results && results.length > 0) {
      const city =
        results[0].components.city ||
        results[0].components.county ||
        results[0].components.town ||
        results[0].components.village;
      return city || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching city from coordinates:', error);
    return null;
  }
}
