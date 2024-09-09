import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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
    // Seeding permissions
    const permission = prisma.permission.createMany({
      skipDuplicates: true,
      data: [
        { id: 1, name: 'super', display_name: 'Super' },
        { id: 2, name: 'admin_access', display_name: 'Admin Access' },
        {
          id: 3,
          name: 'admin_product_access',
          display_name: 'Admin Product Access',
        },
        {
          id: 4,
          name: 'admin_product_list',
          display_name: 'Admin Product List',
        },
        {
          id: 5,
          name: 'admin_product_detail',
          display_name: 'Admin Product Detail',
        },
        {
          id: 6,
          name: 'admin_product_create',
          display_name: 'Admin Product Create',
        },
        {
          id: 7,
          name: 'admin_product_update',
          display_name: 'Admin Product Update',
        },
        {
          id: 8,
          name: 'admin_product_delete',
          display_name: 'Admin Product Delete',
        },
        {
          id: 9,
          name: 'admin_product_category_access',
          display_name: 'Admin Product Category Access',
        },
        {
          id: 10,
          name: 'admin_product_category_list',
          display_name: 'Admin Product List',
        },
        {
          id: 11,
          name: 'admin_product_category_detail',
          display_name: 'Admin Product Detail',
        },
        {
          id: 12,
          name: 'admin_product_category_create',
          display_name: 'Admin Product Create',
        },
        {
          id: 13,
          name: 'admin_product_category_update',
          display_name: 'Admin Product Update',
        },
        {
          id: 14,
          name: 'admin_product_category_delete',
          display_name: 'Admin Product Delete',
        },
      ],
    });

    // Seeding super admin user
    const superAdminUser = prisma.user.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        email: 'super.admin@ogro.com',
        first_name: 'Super',
        last_name: 'Admin',
        username: 'super_admin',
        password: await bcrypt.hash(
          process.env.SUPERUSER_PASSWORD!,
          await bcrypt.genSalt(),
        ),
        validated_at: new Date().toISOString(),
        validation_sent_at: new Date().toISOString(),
        referral: crypto.randomBytes(5).toString('hex').toUpperCase(),
      },
    });

    // Seeding super admin role and permissions
    const superRole = prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'super_admin',
        display_name: 'Super Admin',
        id: 1,
        roles_permissions: {
          createMany: {
            data: [{ id: 1, permission_id: 1 }],
            skipDuplicates: true,
          },
        },
        user_role: {
          createMany: { data: [{ user_id: 1, id: 1 }], skipDuplicates: true },
        },
      },
    });

    // Seeding product categories
    const productCategory = prisma.productCategory.createMany({
      data: [
        { id: 1, name: 'dairy', display_name: 'Dairy' },
        { id: 2, name: 'vegetable', display_name: 'Vegetable' },
        { id: 3, name: 'fruit', display_name: 'Fruit' },
      ],
      skipDuplicates: true,
    });

    // Seeding products
    const products = prisma.product.createMany({
      skipDuplicates: true,
      data: [
        {
          id: 1,
          name: 'SUSU UHT ULTRAMILK 500ML',
          price: 10000,
          sku: 'D0001',
          unit: 'Piece',
          product_category_id: 1,
          description: 'High-quality UHT milk from Ultramilk.',
          slug: 'susu-uht-ultramilk-500ml',
        },
        {
          id: 2,
          name: 'KEJU KRAFT 250GR',
          price: 30000,
          sku: 'D0002',
          unit: 'Piece',
          product_category_id: 1,
          description: 'Rich and creamy cheese from Kraft.',
          slug: 'keju-kraft-250gr',
        },
        {
          id: 3,
          name: 'YOGURT CIMORY 200ML',
          price: 15000,
          sku: 'D0003',
          unit: 'Piece',
          product_category_id: 1,
          description: 'Delicious yogurt from Cimory.',
          slug: 'yogurt-cimory-200ml',
        },
        {
          id: 4,
          name: 'BUTTER BLUE BAND 200GR',
          price: 20000,
          sku: 'D0004',
          unit: 'Piece',
          product_category_id: 1,
          description: 'High-quality butter from Blue Band.',
          slug: 'butter-blue-band-200gr',
        },
        {
          id: 5,
          name: 'CREAM CHEESE PHILADELPHIA 150GR',
          price: 35000,
          sku: 'D0005',
          unit: 'Piece',
          product_category_id: 1,
          description: 'Smooth and creamy cheese from Philadelphia.',
          slug: 'cream-cheese-philadelphia-150gr',
        },
        {
          id: 16,
          name: 'TOMAT 1KG',
          price: 12000,
          sku: 'V0006',
          unit: 'Kilogram',
          product_category_id: 2,
          description: 'Fresh and ripe tomatoes.',
          slug: 'tomat-1kg',
        },
        {
          id: 19,
          name: 'TELUR AYAM 1 LUSIN',
          price: 20000,
          sku: 'D0007',
          unit: 'Lusin',
          product_category_id: 1,
          description: 'Fresh eggs, perfect for daily consumption.',
          slug: 'telur-ayam-1-lusin',
        },
        {
          id: 20,
          name: 'PEAR 1KG',
          price: 35000,
          sku: 'F0007',
          unit: 'Kilogram',
          product_category_id: 3,
          description: 'Juicy and fresh pears.',
          slug: 'pear-1kg',
        },
      ],
    });

    // Seed provinces and cities
    await seedProvinces();
    await seedCities();

    // Execute all database operations
    const [
      res_permission,
      res_superAdminUser,
      res_superRole,
      res_productCategory,
      res_products,
    ] = await Promise.all([
      permission,
      superAdminUser,
      superRole,
      productCategory,
      products,
    ]);
    console.log(
      res_permission,
      res_superAdminUser,
      res_superRole,
      res_productCategory,
      res_products,
    );
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
