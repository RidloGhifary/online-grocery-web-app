import { StockController } from '@/controllers/stock.controller';
import { verifyPermission } from '@/middlewares/verifyPermission';
import { verifyToken } from '@/middlewares/verifyToken';
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

    this.router.get(
      '/store-list',
      verifyToken,
      this.stockController.getStoreForStock,
    );
    this.router.get(
      '/journals',
      verifyToken,
      this.stockController.getJournals,
    );
   
  }

  getRouter(): Router {
    return this.router;
  }
}
