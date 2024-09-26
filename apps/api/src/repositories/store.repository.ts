import CommonPaginatedResultInterface from '@/interfaces/CommonPaginatedResultInterface';
import CommonResultInterface from '@/interfaces/CommonResultInterface';
import prisma from '@/prisma';
import paginate, { numberization } from '@/utils/paginate';
import { Store } from '@prisma/client';

class StoreRepository {
  async getAllStoreNoPaginate():Promise<CommonResultInterface<Store[]>> {
    let result : CommonResultInterface<Store[]> = {
      ok:false
    }
    try {
      const data = await prisma.store.findMany()
      if (data) {
        result.ok= true
        result.data = data
        result.message= 'Query Success'
      }
    } catch (error) {
      result.error = (error as Error).message
      throw new Error(JSON.stringify(result));
    }
    return result
  }
}

export const storeRepository = new StoreRepository();
