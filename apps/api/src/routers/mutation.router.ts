import { MutationController } from '@/controllers/mutation.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';
import { CustomRequest } from '@/controllers/mutation.controller';

export class MutationRouter {
  private router: Router;
  private mutationController: MutationController;

  constructor() {
    this.mutationController = new MutationController();
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/get-mutations', verifyToken, (req, res) =>
      this.mutationController.getPendingStockMutations(
        req as CustomRequest,
        res,
      ),
    );

    this.router.post('/confirm-mutations', verifyToken, (req, res) =>
      this.mutationController.confirmStockMutation(req as CustomRequest, res),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
