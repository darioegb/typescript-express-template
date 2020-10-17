import 'module-alias/register';
import 'dotenv/config';
import 'colors';
import { App }  from '@/config';
import { validateEnv } from '@/utils';
import { IndexController, AuthController, UserController } from '@/controllers';

validateEnv();

const app = new App([
  new IndexController(),
  new AuthController(),
  new UserController(),
]);

app.listen();
