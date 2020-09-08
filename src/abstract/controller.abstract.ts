import { Router } from 'express';

export abstract class Controller {
  protected path: string;
  public router: Router;

  constructor() {
    this.path = '/';
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;
}
