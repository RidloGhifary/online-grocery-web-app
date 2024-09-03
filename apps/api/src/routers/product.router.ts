
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
    this.router.get('/discounts', this.productController.getDiscountProduct);
    this.router.get(
      '/nearest-distance',
      this.productController.getProductByClosestDistance,
    );
    this.router.post('/', this.productController.createProduct);
    this.router.get('/:slug', this.productController.productSingle);
    this.router.get('/:id', (req, res) =>
      this.productController.getProductById(req, res),
    );
    
  }

  getRouter(): Router {
    return this.router;
  }
}
