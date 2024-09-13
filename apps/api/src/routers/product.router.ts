import { ProductController } from '@/controllers/product.controller';
import validateRequestVerbose from '@/middlewares/validateRequestVerbose';
import verifyPermission from '@/middlewares/verifyPermission';
import { verifyToken } from '@/middlewares/verifyToken';
import { createProductSchema, deleteProductSchema, updateProductSchema } from '@/validations/product';
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
    // this.router.get('/', this.productController.getAllProducts);
    this.router.get('/', this.productController.productList);
    this.router.post(
      '/',
      verifyToken,
      validateRequestVerbose(createProductSchema),
      this.productController.createProduct,
    );
    this.router.patch(
      '/update',
      verifyToken,
      validateRequestVerbose(updateProductSchema),
      this.productController.updateProduct,
    );
    this.router.delete(
      '/delete/:id',
      verifyToken,
      (req,res,next) => verifyPermission(req,res,next,'admin_product_delete'),
      validateRequestVerbose(deleteProductSchema,'params'),
      this.productController.deleteProduct,
    );
    // this.router.get('/discounts', this.productController.getDiscountProduct);
    this.router.get(
      '/info/:productId/total-stock',
      this.productController.getTotalStockAcrossStores,
    );
    this.router.get('/locations', this.productController.getProductByLocation);
    this.router.get('/:slug', this.productController.productSingle);
    this.router.get('/details/:id', (req, res) =>
      this.productController.getProductById(req, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
