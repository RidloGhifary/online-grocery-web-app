import {
  Prisma,
  PrismaClient,
  Product,
  StocksAdjustment,
  Store,
  StoreHasProduct,
} from '@prisma/client';
import { faker, tr } from '@faker-js/faker';
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
    const imageUrl = JSON.stringify([faker.image.url()]);

    products.push({
      id: i,
      name,
      price,
      sku,
      unit,
      product_category_id: randomCategory,
      image: imageUrl,
      description,
      slug: faker.helpers.slugify(name).toLowerCase(),
      unit_in_gram: unitInGram,
    });
  }

  return products;
}

async function generateStoreHasProduct(products: Product[], stores: Store[]) {
  let dataFinal: StoreHasProduct[] = [];
  let counter = 1;
  for (const product of products) {
    for (const store of stores) {
      const data = await prisma.storeHasProduct.upsert({
        where: {
          id: counter,
        },
        update: {},
        create: {
          product_id: product.id,
          qty: 10,
          store_id: store.id,
        },
      });
      counter++;
      // console.log(data);
      dataFinal.push(data);
    }
  }
  return dataFinal;
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
          display_name: 'Admin Product Category List',
        },
        {
          id: 11,
          name: 'admin_product_category_detail',
          display_name: 'Admin Product Category Detail',
        },
        {
          id: 12,
          name: 'admin_product_category_create',
          display_name: 'Admin Product Category Create',
        },
        {
          id: 13,
          name: 'admin_product_category_update',
          display_name: 'Admin Category Update',
        },
        {
          id: 14,
          name: 'admin_product_category_delete',
          display_name: 'Admin Category Delete',
        },
        {
          id: 15,
          name: 'admin_user_access',
          display_name: 'Admin User Access',
        },
        {
          id: 16,
          name: 'admin_user_list',
          display_name: 'Admin User list',
        },
        {
          id: 17,
          name: 'admin_user_detail',
          display_name: 'Admin User Detail',
        },
        {
          id: 18,
          name: 'admin_user_create',
          display_name: 'Admin User Create',
        },
        {
          id: 19,
          name: 'admin_user_update',
          display_name: 'Admin User Update',
        },
        {
          id: 20,
          name: 'admin_user_delete',
          display_name: 'Admin User Delete',
        },
        {
          id: 21,
          name: 'admin_role_access',
          display_name: 'Admin Role Access',
        },
        {
          id: 21,
          name: 'admin_role_create',
          display_name: 'Admin Role Create',
        },
        {
          id: 22,
          name: 'admin_role_update',
          display_name: 'Admin Role Update',
        },
        {
          id: 23,
          name: 'admin_role_delete',
          display_name: 'Admin Role Delete',
        },
        {
          id: 24,
          name: 'admin_role_assign',
          display_name: 'Admin Role Assign',
        },
        {
          id: 25,
          name: 'admin_role_list',
          display_name: 'Admin Role List',
        },
      ],
    });

    // Seeding super admin user
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

    // const itterate = Array.from({ length: 25 }, (_, i) => i + 1);

    const storeAdminUser = prisma.user.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        email: 'store.admin@ogro.com',
        first_name: 'Store',
        last_name: 'Admin',
        username: 'store_admin',
        password: await bcrypt.hash(
          process.env.SUPERUSER_PASSWORD!,
          await bcrypt.genSalt(),
        ),
        validated_at: new Date().toISOString(),
        validation_sent_at: new Date().toISOString(),
        referral: crypto.randomBytes(5).toString('hex').toUpperCase(),
      },
    });

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
              {
                permission_id: 2,
              },
              {
                permission_id: 3,
              },
              {
                permission_id: 4,
              },
              {
                permission_id: 5,
              },
              {
                permission_id: 9,
              },
              {
                permission_id: 10,
              },
              {
                permission_id: 15,
              },
              {
                permission_id: 16,
              },
            ],
            // itterate
            // .filter((i) => i > 1)  // Filter out the first permission
            // .map((i) => ({ permission_id: i })),  // Map to the proper permission object,
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
    });
    const stores: Store[] = [
      {
        created_by: 1, 
        name: 'JKT Ogro Central',
        store_type: 'central',
        city_id: 152, 
        address: '123 Main St',
        kecamatan: 'Downtown',
        kelurahan: 'Central',
        image: 'https://placehold.co/600x400.svg',
        latitude: new Prisma.Decimal(12.345678),
        longtitude: new Prisma.Decimal(98.765432),
        id: 1,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        province_id: 6,
      },
      {
        created_by: 1, // Assuming user ID 2 exists
        name: 'JKT Ogro Cabang',
        store_type: 'branch',
        city_id: 152, // Assuming city ID 2 exists
        address: '456 Elm St',
        kecamatan: 'Uptown',
        kelurahan: 'North',
        image: 'https://placehold.co/600x400.svg',
        latitude: new Prisma.Decimal(23.456789),
        longtitude: new Prisma.Decimal(87.654321),
        id: 2,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        province_id: 6,
      },
    ];

    // Seed provinces and cities
    await seedProvinces();
    await seedCities();

    // Execute all database operations
    const storeSeed = prisma.store.createMany({
      data: [...stores],
      skipDuplicates: true,
    });

    const stage1 = await Promise.allSettled([
      permission,
      superAdminUser,
      storeAdminUser,
      productCategory,
    ])
    console.log(stage1);

    const stage2 = await Promise.allSettled([
      products,
      storeAdminRole,
      superRole,
      storeSeed
    ])
    console.log(stage2);
  
    const [productData, storeData] = await Promise.allSettled([
      await prisma.product.findMany(),
      await prisma.store.findMany(),
    ]);

    const productSettled =
      productData.status === 'fulfilled' ? productData.value : [];

    const storeSettled =
      storeData.status === 'fulfilled' ? storeData.value : [];

    if (productSettled.length === 0 || stores.length === 0) {
      throw new Error('Failed to fetch products or stores');
    }
    const generateStoreHasProductData = await generateStoreHasProduct(
      productSettled,
      storeSettled,
    );
    const recentStoreHasProduct = await prisma.storeHasProduct.findMany({include:{product:true, store:true}})
    const stockAdjustmentData: Prisma.StocksAdjustmentCreateManyInput[] =
      recentStoreHasProduct.map((data) => ({
        managed_by_id: 1, // Adjust as necessary
        product_id: data.product_id as number, // Ensure product_id is not null
        qty_change: data.qty as number, // Ensure qty is not null
        type: 'manual',
        destinied_store_id: data.store_id as number, // Ensure store_id is not null
        detail: `Initial stock for product ${data.product?.name} in store ${data.store?.name}`,
        from_store_id: null, // Adjust this value if needed
        order_detail_id: null, // Adjust this value if needed
        adjustment_related_id: null, // Adjust this value if needed
        deletedAt: null, // Assuming you're not setting this for new records
      }));

    const seedStockAdjusment = await prisma.stocksAdjustment.createMany({
      data: [...stockAdjustmentData],
      skipDuplicates: true
    });
    console.log(generateStoreHasProductData);
    console.log(seedStockAdjusment);
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
