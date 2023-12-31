import { Request, Response, NextFunction } from 'express';
import { UserDto, LogInDto } from '@dtos';
import { RequestWithUser } from '@interfaces';
import { authMiddleware, validationMiddleware } from '@middlewares';
import { AuthService, UserService } from '@services';
import Controller from './controller.abstract';
import { User } from '../interfaces/user.interface';

export class AuthController extends Controller {
  public authService = new AuthService();
  public userService = new UserService();

  constructor() {
    super();
    this.path = '/auth';
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(`${this.path}/signup`, validationMiddleware(UserDto), this.signUp);
    this.router.post(`${this.path}/login`, validationMiddleware(LogInDto, true), this.logIn);
    this.router.get(`${this.path}/renew`, authMiddleware, this.renewToken);
  }

  private signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const signUpUser = (await this.userService.createUser(userData)) as User;
      const token = this.authService.createToken(signUpUser);
      res.status(201).json({ data: { token, user: signUpUser }, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  private logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const { token, findUser } = await this.authService.login(userData);
      res.status(200).json({ data: { token, user: findUser }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  private renewToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const findUser = req.user;
      const token = this.authService.createToken(findUser);
      res.status(200).json({ data: { token, user: findUser }, message: 'renew' });
    } catch (error) {
      next(error);
    }
  };
}
