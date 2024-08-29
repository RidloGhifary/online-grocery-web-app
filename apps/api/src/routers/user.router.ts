import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/current-user',
      verifyToken,
      this.userController.getCurrentUser,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
