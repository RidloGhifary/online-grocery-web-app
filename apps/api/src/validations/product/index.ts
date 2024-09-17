import { z } from 'zod';
import { productRepository } from '@/repositories/product.repository';
import { categoryRepository } from '@/repositories/categories.repository';

// Assume that isProductNameExist and isSKUExist are async functions that check the existence of a name and SKU

export const createProductSchema = z.object({
  // id:z.number().positive(),
  sku: z.string().min(1, "SKU is required").refine(
    async (sku) => !(await productRepository.isSKUExist(sku)),
    { message: "SKU already exists, it must be unique" }
  ),
  name: z.string().min(1, "Product name is required").refine(
    async (name) => !(await productRepository.isProductNameExist(name)),
    { message: "Product name already exists, it must be unique" }
  ),
  product_category_id: z.number().positive("Product category must be a valid ID").refine(
    async (id) => (await categoryRepository.isProductCategoryIdExist(id)),
    { message: "Product category not exist" }
  ),
  description: z.string().nullable(),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().positive("Price must be a positive number").optional(),
  unit_in_gram: z.number().positive("Unit in grams must be a positive number").optional(),
  image: z.array(z.string().url("Each image must be a valid URL")).optional().nullable()
});

export const updateProductSchema = z.object({
  id: z.number().positive(),
  sku: z.string().min(1, "SKU is required").optional(),
  name: z.string().min(1, "Product name is required").optional(),
  product_category_id: z.number().positive("Product category must be a valid ID").optional(),
  description: z.string().nullable().optional(),
  unit: z.string().min(1, "Unit is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  unit_in_gram: z.number().positive("Unit in grams must be a positive number").optional(),
  image: z.array(z.string().url("Each image must be a valid URL")).optional().nullable()
}).superRefine(async (data, ctx) => {
  const { id, sku, name } = data;

  if (sku) {
    const isSKUExist = await productRepository.isSKUExist(sku, id);
    if (isSKUExist) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sku'],
        message: "SKU already exists, it must be unique",
      });
    }
  }

  if (name) {
    const isProductNameExist = await productRepository.isProductNameExist(name, id);
    if (isProductNameExist) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['name'],
        message: "Product name already exists, it must be unique",
      });
    }
  }
});
