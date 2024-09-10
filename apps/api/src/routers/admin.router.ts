import { AdminController } from '@/controllers/admin.controller';
import { verifySuperAdmin } from '@/middlewares/verifySuperAdmin';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class AdminRouter {
  private router: Router;
  private adminController: AdminController;

  constructor() {
    this.adminController = new AdminController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      verifySuperAdmin,
      this.adminController.getAllAdmins,
    );
    this.router.post(
      '/assigns/:user_id/stores/:store_id',
      verifyToken,
      verifySuperAdmin,
      this.adminController.assignAdminToStore,
    );
    this.router.post(
      '/unassigned/:user_id/stores/:store_id',
      verifyToken,
      verifySuperAdmin,
      this.adminController.unassignAdminToStore,
    );
    this.router.patch(
      '/switch/:admin_1_id/:admin_2_id',
      verifyToken,
      verifySuperAdmin,
      this.adminController.switchAdminStore,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
