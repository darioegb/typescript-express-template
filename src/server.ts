import 'dotenv/config';
import 'colors';
import App from '@/app';
import { validateEnv } from '@utils';
import { IndexController, AuthController, UserController } from '@controllers';

validateEnv();

const app = new App([new IndexController(), new AuthController(), new UserController()]);

app.listen();
