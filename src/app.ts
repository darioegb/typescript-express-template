// Requires
import express from 'express';
import mongoose from 'mongoose';
import { errorMiddleware } from './middlewares/error.middleware';
import { Controller } from './abstract';

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

  private connectToTheDatabase() {
    const { MONGO_PATH, MONGO_DATABASE } = process.env;
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
    mongoose
      .connect(`mongodb://${MONGO_PATH}/${MONGO_DATABASE}?authSource=admin`, {
        ...options
      })
      .then(() => console.log('DB: \x1b[32m%s\x1b[0m', 'online'))
      .catch((err) => err);
  }
}
