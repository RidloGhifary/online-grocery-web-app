import { CartController } from '@/controllers/cart.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
import { CustomRequest } from '@/controllers/cart.controller';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/items', verifyToken, (req, res) =>
      this.cartController.addItem(req as CustomRequest, res),
    );

    this.router.patch('/items/:productId', verifyToken, (req, res) =>
      this.cartController.updateQuantity(req as CustomRequest, res),
    );

    this.router.delete('/items/:productId', verifyToken, (req, res) =>
      this.cartController.removeItem(req as CustomRequest, res),
    );

    this.router.get('/items', verifyToken, (req, res) =>
      this.cartController.getCartItems(req as CustomRequest, res),
    );

    this.router.post('/select-for-checkout', verifyToken, (req, res) =>
      this.cartController.selectForCheckout(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
