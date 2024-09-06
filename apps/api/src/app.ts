import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import passport from 'passport';
import session from 'express-session';

import './auth';
// import { SampleRouter } from './routers/sample.router';
import { AuthRouter } from './routers/auth.router';
import { ProductRouter } from './routers/product.router';
import { CategoryRouter } from './routers/category.router';
import { CartRouter } from './routers/cart.router';
import { UserRouter } from './routers/user.router';
import { CredentialRouter } from './routers/credential.router';
import { StoreRouter } from './routers/store.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(
      session({ secret: 'cats', resave: false, saveUninitialized: true }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    // const sampleRouter = new SampleRouter();
    // this.app.use('/api/samples', sampleRouter.getRouter());

    const authRouter = new AuthRouter();
    const productRouter = new ProductRouter();
    const categoryRouter = new CategoryRouter()
    // const cartRouter = new CartRouter();
    const userRouter = new UserRouter();
    const credentialRouter = new CredentialRouter();
    const storeRouter = new StoreRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student API!`);
    });

    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/products', productRouter.getRouter())
    this.app.use('/api/categories', categoryRouter.getRouter())

    // this.app.use('/api/cart', cartRouter.getRouter());
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/credentials', credentialRouter.getRouter());
    this.app.use('/api/stores', storeRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}`);
    });
  }
}
