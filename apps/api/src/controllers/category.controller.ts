import { ProductCategoryInputInterface } from '@/interfaces/ProductCategoryInterface';
import { categoryRepository } from '@/repositories/categories.repository';
import { ProductCategory } from '@prisma/client';
import { Request, Response } from 'express';

export class CategoryController {
  async getCategoryList(req: Request, res: Response) {
    const { search, order, order_field } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const data = await categoryRepository.getProductCategoryList({
      search: search as string,
      order: order as 'asc' | 'desc',
      orderField: order_field as 'name' | 'display_name',
      pageNumber : page as number,
      limitNumber : limit as number
    })
    return res.status(200).send(data);
  }

  public async createCategory(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const category: ProductCategory = req.body;
    // console.log(category);
    
    const newData = await categoryRepository.createProductCategory(category);
    if (!newData.ok) {
      return res.status(400).send(newData);
    }
    return res.status(201).send(newData);
  }
  
  public async updateCategory(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const category: ProductCategoryInputInterface = req.body;
    // console.log(category);
    
    const updatedData = await categoryRepository.updateProductCategory(category);
    if (!updatedData.ok) {
      return res.status(400).send(updatedData);
    }
    return res.status(201).send(updatedData);
  }
  
  public async deleteCategory(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const {id}  = req.params
    const deletedCategory = await categoryRepository.deleteProductCategory(Number(id))
    if (!deletedCategory.ok) {
      return res.status(500).send(deletedCategory);
    }
    return res.status(201).send(deletedCategory);
  }
 
}
