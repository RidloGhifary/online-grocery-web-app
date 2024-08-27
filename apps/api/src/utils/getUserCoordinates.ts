import axios from 'axios';

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export default async function getUserCoordinates({
  city,
  province,
}: {
  city: string;
  province: string;
}) {
  try {
    const { data } = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city},${province}&key=${OPENCAGE_API_KEY}&language=en&pretty=1&no_dedupe=1`,
    );

    if (!data || !data.results || data.results.length === 0) {
      return null;
    }

    const geometry = data.results[0].geometry;

    return {
      latitude: geometry.lat,
      longtitude: geometry.lng,
    };
  } catch {
    return null;
  }
}
