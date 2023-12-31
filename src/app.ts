// Requires
import express from 'express';
import { errorMiddleware } from '@middlewares';
import { DBHandler } from '@config';
import { Controller } from '@/controllers';
import { stringOrNumber } from '@utils';

export default class App {
  public app: express.Application;
  public port: stringOrNumber;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`.blue);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToTheDatabase() {
    try {
      const dbHandler = new DBHandler();
      await dbHandler.connect();
      console.log('mongoose on');
    } catch (error) {
      console.error(error);
    }
  }
}
