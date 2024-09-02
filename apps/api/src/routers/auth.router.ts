import { ENV } from '@/config';
import { AuthController } from '@/controllers/auth.controller';
import validateRequest from '@/middlewares/validateRequest';
import {
  loginSchema,
  registerSchema,
  verifyAccountSchema,
} from '@/validations/auth';
import { Router } from 'express';
import passport from 'passport';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/login',
      validateRequest(loginSchema),
      this.authController.login,
    );
    this.router.post(
      '/register',
      validateRequest(registerSchema),
      this.authController.register,
    );
    this.router.post(
      '/verify-account',
      validateRequest(verifyAccountSchema),
      this.authController.verifyAccount,
    );
    this.router.get(
      '/google',
      passport.authenticate('google', { scope: ['email', 'profile'] }),
    );
    this.router.get(
      '/google/callback',
      passport.authenticate('google', {
        failureRedirect: 'http://localhost:8000/api/auth/google/failure',
        failureMessage: 'Google authentication failed or was canceled',
      }),
      function (req, res) {
        const { token } = req.user as any;
        res.redirect(
          `${ENV.NEXT_PUBLIC_APP_URL}/redirect?token=${token}`,
        );
      },
    );
    this.router.get('/google/failure', (req, res) => {
      const failureMessage =
        (req.session as any).messages?.[0] ||
        'Google authentication failed or was canceled';
      res.redirect(
        `${ENV.NEXT_PUBLIC_APP_URL}/redirect?error=${encodeURIComponent(failureMessage)}`,
      );
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
