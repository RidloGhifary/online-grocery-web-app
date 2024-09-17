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

    this.router.get('/manage-order/detail/:id', verifyToken, (req, res) =>
      this.warehouseController.getOrderById(req as CustomRequest, res),
    );

    this.router.post(
      '/manage-order/handle-payment-proof',
      verifyToken,
      (req, res) =>
        this.warehouseController.handlePaymentProof(req as CustomRequest, res),
    );

    this.router.post('/manage-order/deliver-product', verifyToken, (req, res) =>
      this.warehouseController.deliverProduct(req as CustomRequest, res),
    );

    this.router.post('/manage-order/cancel', verifyToken, (req, res) =>
      this.warehouseController.cancelOrder(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
