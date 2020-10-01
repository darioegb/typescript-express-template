import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import { IndexController, AuthController, UserController } from './controllers';

validateEnv();

const app = new App([
  new IndexController(),
  new AuthController(),
  new UserController(),
]);

app.listen();
