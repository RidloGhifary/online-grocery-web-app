import { CredentialController } from '@/controllers/credential.controller';
import validateRequest from '@/middlewares/validateRequest';
import { verifyToken } from '@/middlewares/verifyToken';
import { changeEmailSchema } from '@/validations/credential';
import { Router } from 'express';

export class CredentialRouter {
  private router: Router;
  private credentialController: CredentialController;

  constructor() {
    this.credentialController = new CredentialController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/change-email',
      validateRequest(changeEmailSchema),
      verifyToken,
      this.credentialController.changeEmail,
    );
    this.router.get(
      '/change-email',
      this.credentialController.storeChangeEmailToken,
    );
    this.router.post(
      '/reset-password',
      this.credentialController.forgotPassword,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
