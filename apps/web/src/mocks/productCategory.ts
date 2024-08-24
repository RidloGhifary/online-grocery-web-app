export interface ProductCategoryInterface {
  id: number;
  name: string;
  display_name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export const productsCategories: ProductCategoryInterface[] = [
  {
    id: 1,
    name: 'fruits',
    display_name: 'Fruits & Vegetables',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 2,
    name: 'dairy',
    display_name: 'Dairy & Eggs',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 3,
    name: 'bakery',
    display_name: 'Bakery & Bread',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 4,
    name: 'meat',
    display_name: 'Meat & Seafood',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 5,
    name: 'beverages',
    display_name: 'Beverages',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }
];
