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
        {
          id: 26,
          name: 'admin_stock_access',
          display_name: 'Admin Stock Access',
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
                id: 2,
              },
              {
                permission_id: 3,
                id: 3,
              },
              {
                permission_id: 4,
                id: 4,
              },
              {
                permission_id: 5,
                id: 5,
              },
              {
                permission_id: 9,
                id: 6,
              },
              {
                permission_id: 10,
                id: 7,
              },
              {
                permission_id: 15,
                id: 8,
              },
              {
                permission_id: 16,
                id: 9,
              },
              {
                permission_id: 26,
                id: 10,
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
        latitude: new Prisma.Decimal(-6.2),
        longtitude: new Prisma.Decimal(106.816666),
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
        city_id: 151, // Assuming city ID 2 exists
        address: '456 Elm St',
        kecamatan: 'Uptown',
        kelurahan: 'North',
        image: 'https://placehold.co/600x400.svg',
        latitude: new Prisma.Decimal(-6.2000677),
        longtitude: new Prisma.Decimal(106.8167943),
        id: 2,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        province_id: 6,
      },
      {
        created_by: 1, // Assuming user ID 2 exists
        name: 'KTNG Ogro Cabang',
        store_type: 'branch',
        city_id: 455, // Assuming city ID 2 exists
        address: '456 Elm St',
        kecamatan: 'Uptown',
        kelurahan: 'North',
        image: 'https://placehold.co/600x400.svg',
        latitude: new Prisma.Decimal(-6.16667),
        longtitude: new Prisma.Decimal(106.48333),
        id: 3,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        province_id: 3,
      },
    ];

    const expedition = prisma.expedition.createMany({
      data: [
        { id: 1, name: 'jne', display_name: 'JNE' },
        { id: 2, name: 'pos', display_name: 'Pos Indonesia' },
        { id: 3, name: 'tiki', display_name: 'TIKI' },
      ],
      skipDuplicates: true,
    });
    const orderStatuses = prisma.orderStatus.createMany({
      data: [
        {
          id: 1,
          status: 'waiting for payment',
          createdAt: new Date('2024-09-11T21:03:41.472Z'),
        },
        {
          id: 2,
          status: 'waiting payment confirmation',
          createdAt: new Date('2024-09-11T21:03:41.472Z'),
        },
        {
          id: 3,
          status: 'processing',
          createdAt: new Date('2024-09-11T21:03:41.472Z'),
        },
        {
          id: 4,
          status: 'delivered',
          createdAt: new Date('2024-09-11T21:03:41.472Z'),
        },
        {
          id: 5,
          status: 'completed',
          createdAt: new Date('2024-09-11T21:03:41.473Z'),
        },
        {
          id: 6,
          status: 'cancelled',
          createdAt: new Date('2024-09-11T21:03:41.473Z'),
        },
      ],
      skipDuplicates: true,
    });

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
      expedition,
      orderStatuses,
    ]);
    console.log(stage1);

    const stage2 = await Promise.allSettled([
      products,
      storeAdminRole,
      superRole,
      storeSeed,
    ]);
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
    const recentStoreHasProduct = await prisma.storeHasProduct.findMany({
      include: { product: true, store: true },
    });
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
      skipDuplicates: true,
    });

    const storeHasAdminGenerate: Prisma.StoreHasAdminCreateManyInput[] = [];
    const admin = await prisma.user.findMany({
      where: {
        role: {
          some: {
            AND: [
              {
                role_id: {
                  not: null,
                },
              },
              {
                role_id: {
                  not: 1,
                },
              },
            ],
          },
        },
      },
    });

    const storeFromDb = await prisma.store.findMany();
    admin.forEach((adminUser) => {
      storeFromDb.forEach((store) => {
        storeHasAdminGenerate.push({
          store_id: store.id,
          user_id: adminUser.id,
          assignee_id: 1,
        });
      });
    });

    // Now you can use `storeHasAdminGenerate` in a Prisma `createMany` query to bulk insert
    await prisma.storeHasAdmin.createMany({
      data: storeHasAdminGenerate,
      skipDuplicates: true,
    });

    const customer = await prisma.user.create({
      data: {
        id: 3,
        email: 'user.test@test.gmail',
        first_name: 'test',
        last_name: 'test',
        username: 'testtest',
        image: 'https://cdn-icons-png.flaticon.com/512/10412/10412383.png',
        validated_at: new Date().toISOString(),
        validation_sent_at: new Date().toISOString(),
        referral: crypto.randomBytes(5).toString('hex').toUpperCase(),
        addresses: {
          create: {
            id: 1,
            address: faker.location.streetAddress(),
            is_primary: true,
            kecamatan: 'dasda',
            kelurahan: 'dasdas',
            postal_code: '155789',
            city_id: 455,
            latitude: new Prisma.Decimal(-6.16667),
            longtitude: new Prisma.Decimal(106.48333),
          },
        },
        gender: 'male',
        phone_number: faker.phone.number({ style: 'national' }),
        password: await bcrypt.hash(
          process.env.SUPERUSER_PASSWORD!,
          await bcrypt.genSalt(),
        ),
      },
      include: {
        addresses: true,
      },
    });

    const order = await prisma.order.createMany({
      data: [
        {
          id: 1,
          invoice: faker.commerce.isbn(),
          customer_id: customer.id,
          address_id: customer.addresses.find((e) => e.is_primary === true)
            ?.id!,
          store_id: 3,
          expedition_id: 1,
          managed_by_id: 1,
          order_status_id: 3,
          payment_proof: 'https://placehold.co/600x400.svg',
        },
      ],
      skipDuplicates: true,
    });
    console.log(order);

    const orderDetail = await prisma.orderDetail.createMany({
      data: [
        {
          qty: 11,
          price: 10000,
          sub_total: 20000,
          store_id: 3,
          product_id: 1,
          order_id: 1,
          id:1
        },
        {
          qty: 5,
          price: 10000,
          sub_total: 20000,
          store_id: 3,
          product_id: 2,
          order_id: 1,
          id:2
        },
      ],
      skipDuplicates: true,
    });

    console.log(orderDetail);

    const stockAdjusmentUser = await prisma.stocksAdjustment.createMany({
      data: [
        {
          id: 181,
          type: 'checkout',
          detail: 'eltest',
          destinied_store_id: 3,
          qty_change: -11,
          product_id: 1,
          managed_by_id: 1,
          order_detail_id: 1
        },
        {
          id: 182,
          type: 'checkout',
          detail: 'eltest',
          destinied_store_id: 3,
          qty_change: -5,
          product_id: 2,
          managed_by_id: 1,
          order_detail_id: 2
        },
        // {
        //   id: 182,
        //   type: 'manual',
        //   detail: 'eltest',
        //   mutation_type: 'pending',
        //   from_store_id: 3,
        //   destinied_store_id: 2,
        //   qty_change: -2,
        //   product_id: 1,
        //   managed_by_id: 1,
        //   adjustment_related_id: 1,
        // },
        // {
        //   id:183,
        //   type:'manual',
        //   detail :'eltest',
        //   mutation_type:'complete',
        //   from_store_id:2,
        //   destinied_store_id : 3,
        //   qty_change : 2,
        //   product_id : 1,
        //   managed_by_id : 1,
        //   adjustment_related_id: 1,
        // },
      ],
      skipDuplicates: true,
    });
    const stockAdjusmentUser2 = await prisma.stocksAdjustment.createMany({
      data: [
        {
          id: 183,
          type: 'checkout',
          detail: 'eltest',
          mutation_type: 'pending',
          from_store_id: 2,
          destinied_store_id: 3,
          qty_change: -2,
          product_id: 1,
          managed_by_id: 1,
          adjustment_related_id: 181,
          // order_detail_id : null
        },
        {
          id: 184,
          type: 'manual',
          detail: 'eltest',
          mutation_type: 'pending',
          from_store_id: 3,
          destinied_store_id: 2,
          qty_change: -4,
          product_id: 1,
          managed_by_id: 1,
          adjustment_related_id: 181,
          // order_detail_id : null
        },
        // {
        //   id: 184,
        //   type: 'checkout',
        //   detail: 'eltest',
        //   mutation_type: 'complete',
        //   from_store_id: 2,
        //   destinied_store_id: 3,
        //   qty_change: 0,
        //   product_id: 1,
        //   managed_by_id: 1,
        //   adjustment_related_id: 183,
        //   // order_detail_id : null
        // },
      ],
      skipDuplicates: true,
    });

    const storeProduct = await prisma.storeHasProduct.findFirst({
      where: { product_id: 1, store_id: 3 },
    });

    const storeProductDecreaseAfterCheckout =
      await prisma.storeHasProduct.update({
        where: {
          id: storeProduct?.id,
        },
        data: {
          qty: -1,
        },
      });

    console.log(generateStoreHasProductData);
    console.log(seedStockAdjusment);
    console.log(stockAdjusmentUser);
    console.log(stockAdjusmentUser2);
    console.log(storeProductDecreaseAfterCheckout);

    // console.log(order);
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
