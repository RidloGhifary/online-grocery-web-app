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
    this.router.get('/', this.productController.getAllProducts);
    this.router.get('/discounts', this.productController.getDiscountProduct);
    this.router.get(
      '/closest',
      this.productController.getProductByClosestDistance,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
