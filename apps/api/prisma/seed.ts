import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Fetch provinces using axios
async function fetchProvinces() {
  const response = await axios.get(
    'https://api.rajaongkir.com/starter/province',
    {
      headers: {
        key: process.env.RAJA_ONGKIR_API_KEY, // Replace with your actual API key
      },
    },
  );
  return response.data.rajaongkir.results;
}

// Fetch cities using axios
async function fetchCities() {
  const response = await axios.get('https://api.rajaongkir.com/starter/city', {
    headers: {
      key: process.env.RAJA_ONGKIR_API_KEY, // Replace with your actual API key
    },
  });
  return response.data.rajaongkir.results;
}

// Seed provinces into the database
async function seedProvinces() {
  const provinces = await fetchProvinces();
  for (const province of provinces) {
    await prisma.province.upsert({
      where: { id: parseInt(province.province_id) },
      update: {},
      create: {
        id: parseInt(province.province_id),
        province: province.province,
      },
    });
  }
}

// Seed cities into the database
async function seedCities() {
  const cities = await fetchCities();
  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: parseInt(city.city_id) },
      update: {},
      create: {
        id: parseInt(city.city_id),
        city_name: city.city_name,
        postal_code: city.postal_code,
        type: city.type.toLowerCase() === 'kabupaten' ? 'kabupaten' : 'kota',
        province_id: parseInt(city.province_id), // Directly reference the province ID
      },
    });
  }
}

async function main() {
  try {
    // Seed provinces and cities
    await seedProvinces();
    await seedCities();

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
