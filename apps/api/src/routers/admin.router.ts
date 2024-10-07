import { AdminController } from '@/controllers/admin.controller';
import validateRequestVerbose from '@/middlewares/validateRequestVerbose';
import { verifyPermission } from '@/middlewares/verifyPermission';
import { verifySuperAdmin } from '@/middlewares/verifySuperAdmin';
import { verifyToken } from '@/middlewares/verifyToken';
import { adminCreateSchema, adminUpdateSchema, deleteAdminSchema } from '@/validations/admin';
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
    this.router.get(
      '/available',
      verifyToken,
      verifySuperAdmin,
      this.adminController.getAvailableAdmin,
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
    this.router.get(
      '/manage-admin',
      verifyToken,
      verifyPermission('super'),
      this.adminController.getAllAdmin
    )
    this.router.post(
      '/manage-admin',
      verifyToken,
      verifyPermission('super'),
      validateRequestVerbose(adminCreateSchema),
      this.adminController.createAdmin
    )
    this.router.patch(
      '/manage-admin/update',
      verifyToken,
      verifyPermission('super'),
      validateRequestVerbose(adminUpdateSchema),
      this.adminController.updateAdmin
    )
    this.router.delete(
      '/manage-admin/delete/:id',
      verifyToken,
      verifyPermission('super'),
      validateRequestVerbose(deleteAdminSchema,'params'),
      this.adminController.deleteAdmin
    )
    this.router.get(
      '/manage-customer',
      verifyToken,
      verifyPermission('admin_user_list'),
      this.adminController.getAllCustomer
    )
  }

  getRouter(): Router {
    return this.router;
  }
}
