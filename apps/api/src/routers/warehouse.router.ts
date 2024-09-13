import { WarehouseController } from '@/controllers/warehouse.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
import { CustomRequest } from '@/controllers/checkout.controller';

export class WarehouseRouter {
  private router: Router;
  private warehouseController: WarehouseController;

  constructor() {
    this.warehouseController = new WarehouseController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/manage-orders', verifyToken, (req, res) =>
      this.warehouseController.getOrdersForAdmin(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
