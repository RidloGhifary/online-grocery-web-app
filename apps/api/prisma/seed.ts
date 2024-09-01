import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  try {
    const permission = prisma.permission.createMany({
      skipDuplicates: true,
      data: [
        {
          id: 1,
          name: 'super',
          display_name: 'Super',
        },
        {
          id: 2,
          name: 'admin_access',
          display_name: 'Admin Access',
        },
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

    const superAdminUser = prisma.user.upsert({
      where: {
        id: 1,
      },
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
        referral: crypto.randomBytes(5).toString('hex').toUpperCase(),
      },
    });

    const superRole = prisma.role.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        name: 'super_admin',
        display_name: 'Super Admin',
        id: 1,
        roles_permissions: {
          createMany: {
            data: [
              {
                id: 1,
                permission_id: 1,
              },
            ],
            skipDuplicates: true,
          },
        },
        user_role: {
          createMany: {
            data: [
              {
                user_id: 1,
                id: 1,
              },
            ],
            skipDuplicates: true,
          },
        },
      },
    });

    const productCategory = prisma.productCategory.createMany({
      data: [
        {
          id: 1,
          name: 'dairy',
          display_name: 'Dairy',
        },
        {
          id: 2,
          name: 'vegetable',
          display_name: 'Vegetable',
        },
        {
          id: 3,
          name: 'fruit',
          display_name: 'Fruit',
        },
      ],
    });

    const products = prisma.product.createMany({
      data: [
        // Dairy Products
        {
          id: 1,
          name: 'SUSU UHT ULTRAMILK 500ML',
          price: 10000,
          sku: 'D0001',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'High-quality UHT milk from Ultramilk.',
          current_stock: 50,
        },
        {
          id: 2,
          name: 'KEJU KRAFT 250GR',
          price: 30000,
          sku: 'D0002',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'Rich and creamy cheese from Kraft.',
          current_stock: 30,
        },
        {
          id: 3,
          name: 'YOGURT CIMORY 200ML',
          price: 15000,
          sku: 'D0003',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'Delicious yogurt from Cimory.',
          current_stock: 40,
        },
        {
          id: 4,
          name: 'BUTTER BLUE BAND 200GR',
          price: 20000,
          sku: 'D0004',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'High-quality butter from Blue Band.',
          current_stock: 20,
        },
        {
          id: 5,
          name: 'CREAM CHEESE PHILADELPHIA 150GR',
          price: 35000,
          sku: 'D0005',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'Smooth and creamy cheese from Philadelphia.',
          current_stock: 25,
        },

        // Vegetable Products
        {
          id: 6,
          name: 'KENTANG 1KG',
          price: 15000,
          sku: 'V0001',
          unit: 'Kilogram',
          product_category_id: 2,
          image: '',
          description: 'Fresh potatoes, perfect for cooking.',
          current_stock: 100,
        },
        {
          id: 7,
          name: 'WORTEL 500GR',
          price: 10000,
          sku: 'V0002',
          unit: 'Piece',
          product_category_id: 2,
          image: '',
          description: 'Crunchy and fresh carrots.',
          current_stock: 80,
        },
        {
          id: 8,
          name: 'BROKOLI 250GR',
          price: 12000,
          sku: 'V0003',
          unit: 'Piece',
          product_category_id: 2,
          image: '',
          description: 'Fresh broccoli, rich in nutrients.',
          current_stock: 70,
        },
        {
          id: 9,
          name: 'KACANG PANJANG 300GR',
          price: 8000,
          sku: 'V0004',
          unit: 'Piece',
          product_category_id: 2,
          image: '',
          description: 'Fresh long beans, great for soups.',
          current_stock: 90,
        },
        {
          id: 10,
          name: 'BUNCIS 250GR',
          price: 9000,
          sku: 'V0005',
          unit: 'Piece',
          product_category_id: 2,
          image: '',
          description: 'Fresh green beans, crunchy and tasty.',
          current_stock: 60,
        },

        // Fruit Products
        {
          id: 11,
          name: 'APEL FUJI 1KG',
          price: 35000,
          sku: 'F0001',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Crisp and sweet Fuji apples.',
          current_stock: 50,
        },
        {
          id: 12,
          name: 'PISANG CAVENDISH 1KG',
          price: 25000,
          sku: 'F0002',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Sweet and ripe Cavendish bananas.',
          current_stock: 60,
        },
        {
          id: 13,
          name: 'JERUK SANTANG 1KG',
          price: 30000,
          sku: 'F0003',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Fresh and juicy Santang oranges.',
          current_stock: 40,
        },
        {
          id: 14,
          name: 'ANGGUR MERAH 500GR',
          price: 40000,
          sku: 'F0004',
          unit: 'Piece',
          product_category_id: 3,
          image: '',
          description: 'Sweet and delicious red grapes.',
          current_stock: 35,
        },
        {
          id: 15,
          name: 'ALPUKAT MENTEGA 1KG',
          price: 45000,
          sku: 'F0005',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Creamy and rich butter avocados.',
          current_stock: 25,
        },

        // Additional products for variety
        {
          id: 16,
          name: 'TOMAT 1KG',
          price: 12000,
          sku: 'V0006',
          unit: 'Kilogram',
          product_category_id: 2,
          image: '',
          description: 'Fresh and ripe tomatoes.',
          current_stock: 100,
        },
        {
          id: 17,
          name: 'PEPAYA CALIFORNIA 1KG',
          price: 18000,
          sku: 'F0006',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Sweet and fresh California papayas.',
          current_stock: 40,
        },
        {
          id: 18,
          name: 'SUSU KEDELAI V-SOY 300ML',
          price: 12000,
          sku: 'D0006',
          unit: 'Piece',
          product_category_id: 1,
          image: '',
          description: 'Healthy and delicious soy milk.',
          current_stock: 50,
        },
        {
          id: 19,
          name: 'TELUR AYAM 1 LUSIN',
          price: 20000,
          sku: 'D0007',
          unit: 'Lusin',
          product_category_id: 1,
          image: '',
          description: 'Fresh eggs, perfect for daily consumption.',
          current_stock: 150,
        },
        {
          id: 20,
          name: 'PEAR 1KG',
          price: 35000,
          sku: 'F0007',
          unit: 'Kilogram',
          product_category_id: 3,
          image: '',
          description: 'Juicy and fresh pears.',
          current_stock: 50,
        },
      ],
    });

    const [
      res_permission,
      res_superAdminUser,
      res_superRole,
      res_productCategory,
      res_products,
    ] = await prisma.$transaction([
      permission,
      superAdminUser,
      superRole,
      productCategory,
      products,
    ]);
    console.log({
      res_permission,
      res_superAdminUser,
      res_superRole,
      res_productCategory,
      res_products,
    });

    // console.log({...[...seedRes]});
  } catch (error) {}
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
