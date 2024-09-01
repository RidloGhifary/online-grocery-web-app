
import { ProductController } from '@/controllers/product.controller';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.productController.productList);
    // this.router.get('/:id', this.productController.getSampleDataById);
    // this.router.post('/', this.productController.createSampleData);
  }

  getRouter(): Router {
    return this.router;
  }
}
