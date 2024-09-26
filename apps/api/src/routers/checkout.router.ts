import { CheckoutController } from '@/controllers/checkout.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
import { CustomRequest } from '@/controllers/checkout.controller';

export class CheckoutRouter {
  private router: Router;
  private checkoutController: CheckoutController;

  constructor() {
    this.checkoutController = new CheckoutController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/store-location', verifyToken, (req, res) =>
      this.checkoutController.findNearestStore(req as CustomRequest, res),
    );

    this.router.post('/create-order', verifyToken, (req, res) =>
      this.checkoutController.createOrder(req as CustomRequest, res),
    );

    this.router.get('/get-vouchers', verifyToken, (req, res) =>
      this.checkoutController.getVouchers(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
