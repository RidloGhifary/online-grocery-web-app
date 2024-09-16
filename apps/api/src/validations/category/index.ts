import { categoryRepository } from '@/repositories/categories.repository';
import { z } from 'zod';

export const createProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .refine(
      async (name) =>
        !(await categoryRepository.isProductCategoryNameExist(name)),
      { message: 'Name already exists, it must be unique' },
    ),
  display_name: z
    .string()
    .min(1, 'Product display name is required')
    .refine(
      async (display_name) =>
        !(await categoryRepository.isProductCategoryDisplayNameExist(
          display_name,
        )),
      { message: 'Display name already exists, it must be unique' },
    ),
});

export const updateProductCategorySchema = z
  .object({
    id: z
      .number()
      .positive('Product category must be a valid ID')
      .refine(
        async (id) => await categoryRepository.isProductCategoryIdExist(id),
        { message: 'Product category not exist' },
      ),
    name: z.string().min(1, 'Product category name is required').optional(),
    display_name: z
      .string()
      .min(1, 'Product category display name is required').optional(),
  })
  .superRefine(async (data, ctx) => {
    const { id, display_name, name } = data;
    if (name) {
      const isCategoryNameExist =
        await categoryRepository.isProductCategoryNameExist(name, id);
      if (isCategoryNameExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['name'],
          message: 'Name already exists, it must be unique',
        });
      }
    }
    if (display_name) {
      const isCategoryDisplayNameExist =
        await categoryRepository.isProductCategoryDisplayNameExist(
          display_name,
          id,
        );
      if (isCategoryDisplayNameExist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['display_name'],
          message: 'Display name already exists, it must be unique',
        });
      }
    }
  });

  
export const deleteProductCategorySchema = z.object({
  id: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'id must be a valid number',
  }).transform((val) => Number(val)),
}).superRefine(async (data, ctx) => {
  const { id } = data;
  console.log('from zod');
  
  console.log(id);
  
  const isProductExist = await categoryRepository.isProductCategoryIdExist(id)
  // const hasPermission =  await productRepository.isUserHasProductPermission()
  if (!isProductExist) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['id'],
      message: "Product category did not exist or already deleted",
    });
  }
});