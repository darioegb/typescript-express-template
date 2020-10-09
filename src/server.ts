import { config } from 'dotenv';
import colors from 'colors';
import App from './app';
import validateEnv from './utils/validateEnv';
import { IndexController, AuthController, UserController } from './controllers';

colors.enable();

config({ path: `src/environments/${process.env.NODE_ENV}.env` });

validateEnv();

const app = new App([
  new IndexController(),
  new AuthController(),
  new UserController(),
]);

app.listen();
