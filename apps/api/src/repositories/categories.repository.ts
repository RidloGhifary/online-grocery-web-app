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
  async isProductCategoryIdExist (id?:number) : Promise<boolean>{
    return !!(await prisma.productCategory.findFirst({select:{id:true},where:{id:id}})&&id)
  }
  
}

export const categoryRepository = new CategoryRepository();
