import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
import { CustomRequest } from '@/controllers/checkout.controller';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/create-order', verifyToken, (req, res) =>
      this.orderController.createOrder(req as CustomRequest, res),
    );

    this.router.get('/user-orders/:userId', verifyToken, (req, res) =>
      this.orderController.getOrdersByUser(req as CustomRequest, res),
    );

    this.router.get('/order/:orderId', verifyToken, (req, res) =>
      this.orderController.getOrderById(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
