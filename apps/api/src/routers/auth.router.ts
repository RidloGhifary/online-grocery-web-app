import { AuthController } from '@/controllers/auth.controller';
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
    this.router.post('/login', this.authController.login);
    this.router.post('/register', this.authController.register);
    this.router.post('/verify-account', this.authController.verifyAccount);
    this.router.post('/forgot-password', this.authController.forgotPassword);
    this.router.get(
      '/google',
      passport.authenticate('google', { scope: ['email', 'profile'] }),
    );
    this.router.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/google/failure' }),
      function (req, res) {
        const { token } = req.user as any;
        res.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/redirect?token=${token}`,
        );
      },
    );
    this.router.get('/google/failure', (req, res) => {
      res.send('Google authentication failed');
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
