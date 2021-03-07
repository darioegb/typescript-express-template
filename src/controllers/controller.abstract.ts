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
    const page: number | undefined = req.query.page
      ? +req.query.page
      : undefined;
    const size: number | undefined = req.query.size
      ? +req.query.size
      : undefined;
    const sort: string | undefined = req.query.sort
      ? req.query.sort.toString()
      : undefined;
    const filter: string | undefined = req.query.filter
      ? req.query.filter.toString()
      : undefined;
    return { page, size, sort, filter };
  }
}
