// Requires
import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import { Controller } from './abstract';
import { DBHandler } from './database/dbHandler';

export default class App {
  public app: express.Application;
  public port: string | number;
  public env: boolean;

  constructor(controllers: Controller[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV === 'prod' ? true : false;

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
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
    const dbHandler = new DBHandler();
    await dbHandler.connect();
  }
}
