import CommonResultInterface from '@/interfaces/CommonResultInterface';
import { productRepository } from '@/repositories/product.repository';
import { Request, Response } from 'express';

export class ProductController {
  async productList(req: Request, res: Response) {
    const { category, search, order, order_field } = req.query;
    const result = await productRepository.publicProductList({
      category: category as string,
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'product_name' | 'category',
    });
    if (!result.ok) {
      return res.status(400).send(result);
    }
    return res.status(200).send(result);
  }
  public async productSingle(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const {slug} = req.params
    if (!slug) {
      const response : CommonResultInterface<null> = {
        ok : false,
        error : 'Empty slug'
      }
      return res.status(401).send(response)
    }
    const result = await productRepository.getSingleProduct({slug : slug as string})
    if (!result.ok) {
      if (!result.data) {
        return res.status(404).send(result)
      }
      return res.status(500).send(result)
    }
    return res.status(200).send(result)
  }
}
