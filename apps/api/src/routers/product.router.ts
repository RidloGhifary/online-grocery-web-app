import { ProductController } from '@/controllers/product.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) =>
      this.productController.getAllProducts(req, res),
    );

    this.router.get('/:id', (req, res) =>
      this.productController.getProductById(req, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
