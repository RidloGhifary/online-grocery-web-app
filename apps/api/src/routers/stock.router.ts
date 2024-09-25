import { StockController } from '@/controllers/stock.controller';
import validateRequestVerbose from '@/middlewares/validateRequestVerbose';
import { verifyPermission } from '@/middlewares/verifyPermission';
import { verifyToken } from '@/middlewares/verifyToken';
import {
  createProductCategorySchema,
  deleteProductCategorySchema,
  updateProductCategorySchema,
} from '@/validations/category';
import { Router } from 'express';

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      verifyPermission('admin_stock_access'),
      this.stockController.getProductAndStock,
    );
   
  }

  getRouter(): Router {
    return this.router;
  }
}
