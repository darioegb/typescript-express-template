import { Request, Response, NextFunction } from 'express';
import { Controller } from '../abstract';

export class IndexController extends Controller {

  constructor() {
    super();
    this.initializeRoutes();
  }

  protected initializeRoutes() {
    this.router.get(`${this.path}`, this.index);
  }

  private index = (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}
