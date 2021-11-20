import { userModel } from '@models';
import { hash } from 'bcryptjs';
import { UserDto } from '@dtos';
import { stringOrUndefined, userDtoOrUsersDto, userOrUsers, validateObjectData } from '@utils';
import { HttpException } from '@exceptions';
import { User } from '@interfaces';
import BaseCrudService from './baseCrudService.abstract';

export class UserService extends BaseCrudService<UserDto, User> {
  constructor() {
    super();
    this.model = userModel;
  }

  public async findUserById(userId: string, filter?: stringOrUndefined): Promise<User> {
    try {
      return await this.findEntityById(userId, filter);
    } catch (error) {
      throw new HttpException(409, "You're not user");
    }
  }

  public async createUser(userData: userDtoOrUsersDto): Promise<userOrUsers> {
    validateObjectData(userData, 'UserData');
    if (userData instanceof Array) {
      userData.forEach(async (item) => {
        await this.checkUserExist(item);
        await this.hashUserPassword(item);
      });
    } else {
      await this.checkUserExist(userData);
      await this.hashUserPassword(userData);
    }
    return this.create(userData);
  }

  public async updateUser(userId: string, userData: UserDto): Promise<User> {
    validateObjectData(userData, 'UserData');
    const userExist: boolean = await this.model.exists({ _id: userId });
    if (!userExist) {
      throw new HttpException(404, `You're user with id ${userId} doesn\\'t exists`);
    }
    if (userData.password) {
      userData.password = await hash(userData.password, 10);
    }
    try {
      return await this.update(userId, userData);
    } catch (error) {
      throw new HttpException(409, "You're not user");
    }
  }

  private async checkUserExist(userData: UserDto) {
    const emailExist: boolean = await this.model.exists({
      email: userData.email,
    });
    if (emailExist) {
      throw new HttpException(409, `You're email ${userData.email} already exists`);
    }
  }

  private async hashUserPassword(userData: UserDto) {
    userData.password = await hash(userData.password, 10);
  }
}
