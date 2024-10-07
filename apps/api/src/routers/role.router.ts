import { RoleController } from '@/controllers/role.controller';
import { verifyPermission } from '@/middlewares/verifyPermission';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class RoleRouter {
  private router: Router;
  private roleController: RoleController;

  constructor() {
    this.roleController = new RoleController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      verifyPermission('admin_role_list'),
      this.roleController.getRoleList,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
