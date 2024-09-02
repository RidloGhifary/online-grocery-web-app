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
    this.router.patch(
      '/biodata',
      verifyToken,
      this.userController.updateUserBiodata,
    );
    this.router.post(
      '/addresses',
      verifyToken,
      this.userController.insertUserAddress,
    );
    this.router.delete(
      '/addresses/:address_id',
      verifyToken,
      this.userController.deleteUserAddress,
    );
    this.router.patch(
      '/addresses/:address_id',
      verifyToken,
      this.userController.useAddressAsPrimary,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
