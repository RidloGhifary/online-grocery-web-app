import { StoreController } from '@/controllers/store.controller';
import validateRequest from '@/middlewares/validateRequest';
import { verifySuperAdmin } from '@/middlewares/verifySuperAdmin';
import { verifyToken } from '@/middlewares/verifyToken';
import { createStoreSchema } from '@/validations/store';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validateRequest(createStoreSchema),
      verifyToken,
      verifySuperAdmin,
      this.storeController.createStore,
    );
    this.router.patch(
      '/:id',
      validateRequest(createStoreSchema),
      verifyToken,
      verifySuperAdmin,
      this.storeController.updateStore,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      verifySuperAdmin,
      this.storeController.deleteStore,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
