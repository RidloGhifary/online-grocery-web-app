
import { CategoryController } from '@/controllers/category.controller';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.categoryController.getCategoryList);
  }

  getRouter(): Router {
    return this.router;
  }
}
