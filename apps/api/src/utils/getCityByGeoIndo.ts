import axios from 'axios';

export default async function getCityByGeoIndo(
  latitude: number | string,
  longitude: number | string,
): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: `${latitude},${longitude}`,
          key: process.env.OPENCAGE_API_KEY,
          language: 'id',
        },
      },
    );

    const results = response.data.results;
    // console.log(results[0].components.county);
    // console.log(results);

    if (results && results.length > 0) {
      const city =
        (results[0].components.city_district as string) ||
        (results[0].components.county as string);
      return city || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching city from coordinates:', error);
    return null;
  }
}
