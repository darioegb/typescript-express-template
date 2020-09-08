import { userModel } from '../models';
import { hash } from 'bcryptjs';
import { UserDto } from '../dtos';
import { validateObjectData } from '../utils/util';
import { HttpException } from '../exceptions';
import { User } from '../interfaces';
import { BaseCrudService } from '../abstract';

export class UserService extends BaseCrudService<UserDto, User> {
  constructor() {
    super();
    this.model = userModel;
  }

  public async findUserById(
    userId: string,
    filter: string | undefined
  ): Promise<User> {
    try {
      return await this.findEntityById(userId, filter);
    } catch (error) {
      throw new HttpException(409, 'You\'re not user');
    }
  }

  public async createUser(userData: UserDto): Promise<User> {
    validateObjectData(userData, 'UserData');
    const emailExist: boolean = await this.model.exists({
      email: userData.email,
    });
    if (emailExist) {
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists`
      );
    }
    userData.password = await hash(userData.password, 10);
    return await this.create(userData);
  }

  public async updateUser(userId: string, userData: UserDto): Promise<User> {
    validateObjectData(userData, 'UserData');
    const userExist: boolean = await this.model.exists({ _id: userId });
    if (!userExist) {
      throw new HttpException(
        404,
        `You're user with id ${userId} doesn\'t exists`
      );
    }
    userData.password = await hash(userData.password, 10);
    try {
      return await this.update(userId, userData);
    } catch (error) {
      throw new HttpException(409, 'You\'re not user');
    }
  }

}
