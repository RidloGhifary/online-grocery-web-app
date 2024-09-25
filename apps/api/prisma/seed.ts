import { DiscountType, PrismaClient } from '@prisma/client';
import type { Product, Store } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';
import axios from 'axios';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function generateProducts() {
  const categories = [1, 2, 3]; // Assuming 3 product categories: dairy, vegetable, fruit
  const products = [];

  for (let i = 1; i <= 60; i++) {
    const randomCategory = faker.helpers.arrayElement(categories);
    const unit = faker.helpers.arrayElement(['Piece', 'Kilogram', 'Lusin']);
    const name = faker.commerce.productName();
    const price = parseFloat(faker.commerce.price({ min: 10000, max: 100000 }));
    const sku = `SKU${i.toString().padStart(4, '0')}`;
    const description = faker.commerce.productDescription();
    const unitInGram = faker.number.int({ min: 10, max: 100 });
    // const imageUrl = JSON.stringify([faker.image.url()])

    products.push({
      id: i,
      name,
      price,
      sku,
      unit,
      image: null,
      product_category_id: randomCategory,
      description,
      slug: faker.helpers.slugify(name).toLowerCase(),
      unit_in_gram: unitInGram,
    });
  }

  return products;
}

async function generateStoreHasProduct(products: Product[], stores: Store[]) {
  for (const product of products) {
    for (const store of stores) {
      await prisma.storeHasProduct.create({
        data: {
          product_id: product.id,
          qty: faker.number.int({ min: 1, max: 50 }),
          store_id: store.id,
        },
      });
    }
  }
}

async function seedProductDiscounts() {
  // Sample discounts data to seed
  const discounts = [
    {
      discount: 10, // percentage
      started_at: new Date('2024-01-01'),
      end_at: new Date('2024-12-31'),
      product_id: 1,
      discount_type: DiscountType.percentage,
    },
    {
      discount: 15, // percentage
      started_at: new Date('2024-06-01'),
      end_at: new Date('2024-11-30'),
      product_id: 2,
      discount_type: DiscountType.percentage,
    },
    {
      discount: 5000, // nominal
      started_at: new Date('2024-03-01'),
      end_at: new Date('2024-09-30'),
      product_id: 3,
      discount_type: DiscountType.nominal,
    },
    {
      discount: 20, // percentage
      started_at: new Date('2024-05-01'),
      end_at: new Date('2024-12-31'),
      product_id: 4,
      discount_type: DiscountType.percentage,
    },
    {
      discount: 2500, // nominal
      started_at: new Date('2024-07-01'),
      end_at: new Date('2024-10-31'),
      product_id: 5,
      discount_type: DiscountType.nominal,
    },
    {
      discount: 30, // percentage
      started_at: new Date('2024-08-01'),
      end_at: new Date('2024-11-30'),
      product_id: 6,
      discount_type: DiscountType.percentage,
    },
    {
      discount: 3500, // nominal
      started_at: new Date('2024-09-01'),
      end_at: new Date('2024-12-31'),
      product_id: 7,
      discount_type: DiscountType.nominal,
    },
    {
      discount: 5, // percentage
      started_at: new Date('2024-01-15'),
      end_at: new Date('2024-06-30'),
      product_id: 8,
      discount_type: DiscountType.percentage,
    },
    {
      discount: 2000, // nominal
      started_at: new Date('2024-02-01'),
      end_at: new Date('2024-08-31'),
      product_id: 9,
      discount_type: DiscountType.nominal,
    },
    {
      discount: 12, // percentage
      started_at: new Date('2024-04-01'),
      end_at: new Date('2024-10-31'),
      product_id: 10,
      discount_type: DiscountType.percentage,
    },
  ];

  for (const discount of discounts) {
    await prisma.productDiscount.upsert({
      where: {
        id: discount.product_id,
      },
      update: {},
      create: {
        discount: discount.discount,
        started_at: discount.started_at,
        end_at: discount.end_at,
        product: {
          connect: { id: discount.product_id },
        },
        discount_type: discount.discount_type,
      },
    });
  }

  console.log('Product discounts seeding completed!');
}

const storesData: Store[] = [
  {
    created_by: 1, // Assuming user ID 1 exists
    name: 'JKT Ogro Central',
    store_type: 'central',
    city_id: 152, // Assuming city ID 1 exists
    address: '123 Main St',
    kecamatan: 'Downtown',
    kelurahan: 'Central',
    image: null,
    latitude: new Decimal(12.345678),
    longtitude: new Decimal(98.765432),
    id: 1,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    province_id: 6,
  },
  {
    created_by: 1, // Assuming user ID 2 exists
    name: 'Karanganyar Ogro Cabang',
    store_type: 'branch',
    city_id: 169,
    address: '456 Elm St',
    kecamatan: 'Uptown',
    kelurahan: 'North',
    image: null,
    latitude: new Decimal(-7.6196965),
    longtitude: new Decimal(111.0698003),
    id: 2,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    province_id: 10,
  },
];

async function seedStores() {
  const batchSize = 5; // Adjust the batch size as necessary
  for (let i = 0; i < storesData.length; i += batchSize) {
    const batch = storesData.slice(i, i + batchSize);

    // Prepare data for upserting
    const upsertData = batch.map((store) => ({
      where: { id: store.id }, // Use the id property as the unique identifier
      create: store,
      update: {}, // No update needed if it exists
    }));

    try {
      // Use `upsert` to ensure each store is created only if it doesn't exist
      for (const store of upsertData) {
        await prisma.store.upsert(store);
      }
      console.log(`Batch ${i / batchSize + 1} inserted successfully.`);
    } catch (error) {
      console.error(`Error inserting batch starting at index ${i}:`, error);
    }
  }
}

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

    const storeAdminUser = prisma.user.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        email: 'windah.admin@ogro.com', // Random email
        first_name: 'Windah',
        last_name: 'Basudara',
        username: 'Windah Basudara', // Random username
        password: await bcrypt.hash(
          process.env.SUPERUSER_PASSWORD!, // Set the password here
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

    // Seeding store admin role and permissions
    const storeAdminRole = prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'store_admin',
        display_name: 'Store Admin',
        id: 2,
        roles_permissions: {
          createMany: {
            data: [
              { id: 2, permission_id: 2 }, // Add permissions relevant to the store admin role
            ],
            skipDuplicates: true,
          },
        },
        user_role: {
          createMany: { data: [{ user_id: 2, id: 2 }], skipDuplicates: true },
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
      data: [...generateProducts()],
      // data: [
      //   // Dairy Products
      //   {
      //     id: 1,
      //     name: 'SUSU UHT ULTRAMILK 500ML',
      //     price: 10000,
      //     sku: 'D0001',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'High-quality UHT milk from Ultramilk.',
      //     slug: 'susu-uht-ultramilk-500ml',
      //     unit_in_gram : 200
      //   },
      //   {
      //     id: 2,
      //     name: 'KEJU KRAFT 250GR',
      //     price: 30000,
      //     sku: 'D0002',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'Rich and creamy cheese from Kraft.',
      //     slug: 'keju-kraft-250gr',
      //   },
      //   {
      //     id: 3,
      //     name: 'YOGURT CIMORY 200ML',
      //     price: 15000,
      //     sku: 'D0003',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'Delicious yogurt from Cimory.',
      //     slug: 'yogurt-cimory-200ml',
      //   },
      //   {
      //     id: 4,
      //     name: 'BUTTER BLUE BAND 200GR',
      //     price: 20000,
      //     sku: 'D0004',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'High-quality butter from Blue Band.',
      //     slug: 'butter-blue-band-200gr',
      //   },
      //   {
      //     id: 5,
      //     name: 'CREAM CHEESE PHILADELPHIA 150GR',
      //     price: 35000,
      //     sku: 'D0005',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'Smooth and creamy cheese from Philadelphia.',
      //     slug: 'cream-cheese-philadelphia-150gr',
      //   },

      //   // Vegetable Products
      //   {
      //     id: 6,
      //     name: 'KENTANG 1KG',
      //     price: 15000,
      //     sku: 'V0001',
      //     unit: 'Kilogram',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Fresh potatoes, perfect for cooking.',
      //     slug: 'kentang-1kg',
      //   },
      //   {
      //     id: 7,
      //     name: 'WORTEL 500GR',
      //     price: 10000,
      //     sku: 'V0002',
      //     unit: 'Piece',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Crunchy and fresh carrots.',
      //     slug: 'wortel-500gr',
      //   },
      //   {
      //     id: 8,
      //     name: 'BROKOLI 250GR',
      //     price: 12000,
      //     sku: 'V0003',
      //     unit: 'Piece',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Fresh broccoli, rich in nutrients.',
      //     slug: 'brokoli-250gr',
      //   },
      //   {
      //     id: 9,
      //     name: 'KACANG PANJANG 300GR',
      //     price: 8000,
      //     sku: 'V0004',
      //     unit: 'Piece',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Fresh long beans, great for soups.',
      //     slug: 'kacang-panjang-300gr',
      //   },
      //   {
      //     id: 10,
      //     name: 'BUNCIS 250GR',
      //     price: 9000,
      //     sku: 'V0005',
      //     unit: 'Piece',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Fresh green beans, crunchy and tasty.',
      //     slug: 'buncis-250gr',
      //   },

      //   // Fruit Products
      //   {
      //     id: 11,
      //     name: 'APEL FUJI 1KG',
      //     price: 35000,
      //     sku: 'F0001',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Crisp and sweet Fuji apples.',
      //     slug: 'apel-fuji-1kg',
      //   },
      //   {
      //     id: 12,
      //     name: 'PISANG CAVENDISH 1KG',
      //     price: 25000,
      //     sku: 'F0002',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Sweet and ripe Cavendish bananas.',
      //     slug: 'pisang-cavendish-1kg',
      //   },
      //   {
      //     id: 13,
      //     name: 'JERUK SANTANG 1KG',
      //     price: 30000,
      //     sku: 'F0003',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Fresh and juicy Santang oranges.',
      //     slug: 'jeruk-santang-1kg',
      //   },
      //   {
      //     id: 14,
      //     name: 'ANGGUR MERAH 500GR',
      //     price: 40000,
      //     sku: 'F0004',
      //     unit: 'Piece',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Sweet and delicious red grapes.',
      //     slug: 'anggur-merah-500gr',
      //   },
      //   {
      //     id: 15,
      //     name: 'ALPUKAT MENTEGA 1KG',
      //     price: 45000,
      //     sku: 'F0005',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Creamy and rich butter avocados.',
      //     slug: 'alpukat-mentega-1kg',
      //   },

      //   // Additional products for variety
      //   {
      //     id: 16,
      //     name: 'TOMAT 1KG',
      //     price: 12000,
      //     sku: 'V0006',
      //     unit: 'Kilogram',
      //     product_category_id: 2,
      //     image: '',
      //     description: 'Fresh and ripe tomatoes.',
      //     slug: 'tomat-1kg',
      //   },
      //   {
      //     id: 17,
      //     name: 'PEPAYA CALIFORNIA 1KG',
      //     price: 18000,
      //     sku: 'F0006',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Sweet and fresh California papayas.',
      //     slug: 'pepaya-california-1kg',
      //   },
      //   {
      //     id: 18,
      //     name: 'SUSU KEDELAI V-SOY 300ML',
      //     price: 12000,
      //     sku: 'D0006',
      //     unit: 'Piece',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'Healthy and delicious soy milk.',
      //     slug: 'susu-kedelai-v-soy-300ml',
      //   },
      //   {
      //     id: 19,
      //     name: 'TELUR AYAM 1 LUSIN',
      //     price: 20000,
      //     sku: 'D0007',
      //     unit: 'Lusin',
      //     product_category_id: 1,
      //     image: '',
      //     description: 'Fresh eggs, perfect for daily consumption.',
      //     slug: 'telur-ayam-1-lusin',
      //   },
      //   {
      //     id: 20,
      //     name: 'PEAR 1KG',
      //     price: 35000,
      //     sku: 'F0007',
      //     unit: 'Kilogram',
      //     product_category_id: 3,
      //     image: '',
      //     description: 'Juicy and fresh pears.',
      //     slug: 'pear-1kg',
      //   },
      // ],
    });

    // Seed provinces and cities
    await seedProvinces();
    await seedCities();

    // Execute all database operations
    await Promise.all([
      permission,
      superAdminUser,
      storeAdminUser,
      superRole,
      storeAdminRole,
      productCategory,
      products,
      // storeSeed,
    ]);

    await seedStores();
    await seedProductDiscounts();

    await generateStoreHasProduct(
      await prisma.product.findMany(),
      await prisma.store.findMany(),
    );

    console.log('Data successfully seeded');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
