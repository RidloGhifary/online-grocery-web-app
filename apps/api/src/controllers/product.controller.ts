import { productRepository } from '@/repositories/product.repository';
import { Request, Response } from 'express';

export class ProductController {
  async productList(req: Request, res: Response) {
    const {category , search, order, order_field} = req.query
    const result = await productRepository.publicProductList({
      category : category as string ,
      search : search as string ,
      order : order as 'asc'| 'desc',
      orderField : order_field as 'product_name' | 'category'
    })
    if (!result.ok) {
      return res.status(400).send(
        result
      )
    }
    return res.status(200).send(result);
  }

  // async getSampleDataById(req: Request, res: Response) {
  //   return res.status(200);
  // }

  // async createSampleData(req: Request, res: Response) {
  //   return res.status(201);
  // }
}
