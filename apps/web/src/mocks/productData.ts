export interface ProductInterface {
  id: number;
  sku: string;
  name: string;
  product_category_id: number;
  description: string | null;
  current_stock: number;
  unit: string;
  price: number;
  image: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
  store_id: number | null;
}
export const products: ProductInterface[] = [
  {
    id: 1,
    sku: 'PROD001',
    name: 'Organic Bananas',
    product_category_id: 1,
    description: 'Fresh organic bananas, perfect for a healthy snack.',
    current_stock: 120,
    unit: 'kg',
    price: 37000, // Price in IDR
    image: 'https://example.com/images/bananas.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 1,
  },
  {
    id: 2,
    sku: 'PROD002',
    name: 'Almond Milk',
    product_category_id: 2,
    description: 'Unsweetened almond milk, a great dairy alternative.',
    current_stock: 80,
    unit: 'liter',
    price: 45000, // Price in IDR
    image: 'https://example.com/images/almond-milk.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 1,
  },
  {
    id: 3,
    sku: 'PROD003',
    name: 'Whole Grain Bread',
    product_category_id: 3,
    description: 'Soft and fresh whole grain bread.',
    current_stock: 50,
    unit: 'loaf',
    price: 27000, // Price in IDR
    image: 'https://example.com/images/bread.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 2,
  },
  {
    id: 4,
    sku: 'PROD004',
    name: 'Organic Eggs',
    product_category_id: 4,
    description: 'Free-range organic eggs, 12-pack.',
    current_stock: 200,
    unit: 'pack',
    price: 67500, // Price in IDR
    image: 'https://example.com/images/eggs.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 2,
  },
  {
    id: 5,
    sku: 'PROD005',
    name: 'Greek Yogurt',
    product_category_id: 5,
    description: 'Creamy and rich Greek yogurt, high in protein.',
    current_stock: 100,
    unit: 'cup',
    price: 18000, // Price in IDR
    image: 'https://example.com/images/yogurt.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 3,
  },
  {
    id: 6,
    sku: 'PROD006',
    name: 'Chicken Breast',
    product_category_id: 6,
    description: 'Lean and tender chicken breast, skinless and boneless.',
    current_stock: 75,
    unit: 'kg',
    price: 105000, // Price in IDR
    image: 'https://example.com/images/chicken.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 3,
  },
  {
    id: 7,
    sku: 'PROD007',
    name: 'Broccoli',
    product_category_id: 7,
    description: 'Fresh and crunchy broccoli, great for steaming or salads.',
    current_stock: 60,
    unit: 'kg',
    price: 34500, // Price in IDR
    image: 'https://example.com/images/broccoli.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 4,
  },
  {
    id: 8,
    sku: 'PROD008',
    name: 'Quinoa',
    product_category_id: 8,
    description: 'Organic quinoa, a healthy grain alternative.',
    current_stock: 40,
    unit: 'kg',
    price: 75000, // Price in IDR
    image: 'https://example.com/images/quinoa.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 4,
  },
  {
    id: 9,
    sku: 'PROD009',
    name: 'Orange Juice',
    product_category_id: 9,
    description: 'Freshly squeezed orange juice, no added sugar.',
    current_stock: 110,
    unit: 'liter',
    price: 48000, // Price in IDR
    image: 'https://example.com/images/orange-juice.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 5,
  },
  {
    id: 10,
    sku: 'PROD010',
    name: 'Dark Chocolate',
    product_category_id: 10,
    description: 'Rich and smooth dark chocolate, 70% cocoa.',
    current_stock: 90,
    unit: 'bar',
    price: 30000, // Price in IDR
    image: 'https://example.com/images/dark-chocolate.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    store_id: 5,
  }
];
