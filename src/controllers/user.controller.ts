import { Request, Response, NextFunction } from 'express';

import { UserService } from '../services';
import { UserDto } from '../dtos';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { User } from '../interfaces';
import { autoMapper } from '../utils/util';
import { Controller } from '../abstract';
import { authMiddleware } from '../middlewares';

export class UserController extends Controller {
  private userService = new UserService();

  constructor() {
    super();
    this.path = '/users';
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get(`${this.path}/`, authMiddleware, this.getUsersByPage);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    this.router.post(
      `${this.path}/`,
      [authMiddleware,
      validationMiddleware(UserDto)],
      this.createUser
    );
    this.router.put(
      `${this.path}/:id`,
      [authMiddleware,
        validationMiddleware(UserDto, true)],
      this.updateUser
    );
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteUser);
  }

  private getUsersByPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const page: number | undefined = req.query.page
      ? Number(req.query.page)
      : undefined;
    const size: number | undefined = req.query.size
      ? Number(req.query.size)
      : undefined;
    const sort: string | undefined = req.query.sort
      ? String(req.query.sort)
      : undefined;
    const filter: string | undefined = req.query.filter
      ? String(req.query.filter)
      : undefined;

    try {
      const result = await this.userService.findEntityByPage(
        page,
        size,
        sort,
        filter
      );
      result.items = result.items.map((item) => autoMapper(item, UserDto));
      res.status(200).json({ data: result, message: 'findByPage' });
    } catch (err) {
      next(err);
    }
  };

  private getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.id;
    const filter: string | undefined = req.query.filter
      ? String(req.query.filter)
      : undefined;

    try {
      const findOneUser: UserDto = autoMapper(
        await this.userService.findUserById(userId, filter),
        UserDto
      );
      res.status(200).json({ data: findOneUser, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  private createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userData: UserDto = req.body;
    
    try {
      const user: UserDto = autoMapper(
        await this.userService.createUser(userData),
        UserDto
      );
      res.status(201).json({ data: user, message: 'created' });
    } catch (err) {
      next(err);
    }
  };

  private updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.id;
    const userData: UserDto = req.body;

    try {
      const updatedUser: UserDto = autoMapper(
        await this.userService.updateUser(userId, userData),
        UserDto
      );
      res.status(200).json({ data: updatedUser, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  private deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.id;

    try {
      const deletedUser: User = await this.userService.delete(userId);
      res.status(200).json({ data: deletedUser, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

}
