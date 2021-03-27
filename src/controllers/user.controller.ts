import { Request, Response, NextFunction } from 'express';

import { UserService } from '@/services';
import { UserDto } from '@/data/dtos';
import { RequestWithUser, User } from '@/data/interfaces';
import { autoMapper, userDtoOrUsersDto } from '@/utils';
import {
  validationMiddleware,
  authMiddleware,
  isAdminMiddleware,
  isAdminOrSameUserMiddleware
} from '@/middlewares';
import Controller from './controller.abstract';

export class UserController extends Controller {
  public userService = new UserService();

  constructor() {
    super();
    this.path = '/users';
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.get(this.path, authMiddleware, this.getUsersByPage);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById);
    this.router.post(
      this.path,
      [authMiddleware, isAdminMiddleware, validationMiddleware(UserDto)],
      this.createUser
    );
    this.router.put(
      `${this.path}/:id`,
      [
        authMiddleware,
        isAdminOrSameUserMiddleware,
        validationMiddleware(UserDto, true),
      ],
      this.updateUser
    );
    this.router.delete(
      `${this.path}/:id`,
      [authMiddleware, isAdminMiddleware],
      this.deleteUser
    );
  }

  private getUsersByPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { page, size, sort, filter } = this.getPagingAndSortParams(req);

    try {
      const result = await this.userService.findEntityByPage(
        page,
        size,
        sort,
        filter
      );
      result.items = result.items.map((item) => autoMapper(item, UserDto));
      res.status(200).json({ data: result, message: 'findByPage' });
    } catch (error) {
      next(error);
    }
  };

  private getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId: string = req.params.id;
    const { filter } = this.getPagingAndSortParams(req);

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
      const user = await this.userService.createUser(userData);
      let createdUser: userDtoOrUsersDto;
      if (user instanceof Array) {
        createdUser = user.map((item) => autoMapper(item, UserDto));
      } else {
        createdUser = autoMapper(user, UserDto);
      }
      res.status(201).json({ data: createdUser, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  private updateUser = async (
    req: RequestWithUser,
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
    req: RequestWithUser,
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
