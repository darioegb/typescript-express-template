import { Request, Response, NextFunction } from 'express';
import { Controller } from '../abstract';
import { UserDto, LogInDto } from '../dtos';
import { validationMiddleware } from '../middlewares';
import { AuthService, UserService } from '../services';
import { autoMapper } from '../utils/util';

export class AuthController extends Controller {
  public authService = new AuthService();
  public userService = new UserService();

  constructor() {
    super();
    this.path = '/auth';
    this.initializeRoutes();
  }

  protected initializeRoutes(): void {
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(UserDto),
      this.signUp
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.logIn
    );
  }

  private signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const signUpUser: UserDto = autoMapper(
        await this.userService.createUser(userData),
        UserDto
      );
      const token = this.authService.createToken(signUpUser);
      res
        .status(201)
        .json({ data: { token, user: signUpUser }, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  private logIn = async (req: Request, res: Response, next: NextFunction) => {
    const userData: UserDto = req.body;

    try {
      const { token, findUser } = await this.authService.login(userData);
      res
        .status(200)
        .json({ data: { token, user: findUser }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
}
