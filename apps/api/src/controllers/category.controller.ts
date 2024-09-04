import { categoryRepository } from '@/repositories/categories.repository';
import { Request, Response } from 'express';

export class CategoryController {
  async getCategoryList(req: Request, res: Response) {
    const data = await categoryRepository.getProductCategoryList()
    return res.status(200).send(data);
  }

 
}
