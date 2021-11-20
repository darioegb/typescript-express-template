import { Request, Response, NextFunction } from 'express';
import Controller from './controller.abstract';

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
      res.status(200).json({ message: 'server is online' });
    } catch (error) {
      next(error);
    }
  };
}
