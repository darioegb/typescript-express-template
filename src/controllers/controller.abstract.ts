import { numberOrUndefined, stringOrUndefined } from '@/utils';
import { Request, Router } from 'express';

export default abstract class Controller {
  public path: string;
  public router: Router;

  constructor() {
    this.path = '/';
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;

  protected getPagingAndSortParams(req: Request) {
    const page: numberOrUndefined = req.query.page
      ? +req.query.page
      : undefined;
    const size: numberOrUndefined = req.query.size
      ? +req.query.size
      : undefined;
    const sort: stringOrUndefined = req.query.sort
      ? req.query.sort.toString()
      : undefined;
    const filter: stringOrUndefined = req.query.filter
      ? req.query.filter.toString()
      : undefined;
    return { page, size, sort, filter };
  }
}
