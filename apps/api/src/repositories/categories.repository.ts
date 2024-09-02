import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import { ProductCategory } from '@prisma/client';

class CategoryRepository {
  
  async getProductCategoryList () : Promise<CommonResultInterface<ProductCategory[]>> {
    const result: CommonResultInterface<ProductCategory[]> = {
      ok: false,
    };
    try {
      const res = await prisma.productCategory.findMany()
      result.data = res
      result.ok = true
      result.message = 'Query Success'
    } catch (error) {
      result.error = error
      result.message = 'Error'
    }
    return result
  }
  
}

export const categoryRepository = new CategoryRepository();
