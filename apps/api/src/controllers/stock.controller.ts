import prisma from '@/prisma';
import { stockRepository } from '@/repositories/stock.repository';
import { storeRepository } from '@/repositories/store.repository';
import { Request, Response } from 'express';

export class StockController {
  async getProductAndStock(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    let userId: number | null | undefined = req.currentUser?.id;
    if (!userId) {
      userId = null;
    }
    const { search, order, order_field, store_id } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const result = await stockRepository.getAdminProductStockList({
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'product_name' | 'category',
      pageNumber: page as number,
      limitNumber: limit as number,
      adminId: userId,
      storeId: Number(store_id),
    });
    if (!result.ok) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }

  async getStoreForStock(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    const result = await storeRepository.getAllStoreNoPaginate();
    if (!result.ok) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }

  public async getJournals(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { page = 1, limit = 20, store_id } = req.query;
    // console.log({
    //   pageNumber : page as number,
    //   limitNumber : limit as number,
    //   storeId : Number(store_id)
    // });

    const result = await stockRepository.getStockJournal({
      pageNumber: page as number,
      limitNumber: limit as number,
      storeId: Number(store_id),
    });
    if (!result.ok) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
}
