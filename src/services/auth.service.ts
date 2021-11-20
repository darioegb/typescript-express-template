import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { UserDto } from '@dtos';
import { HttpException } from '@exceptions';
import { User, DataStoredInToken } from '@interfaces';
import { userModel } from '@models';
import { validateObjectData } from '@utils';

export class AuthService {
  public model = userModel;

  public async login(userData: UserDto): Promise<{ token: string; findUser: User }> {
    validateObjectData(userData, 'UserData');
    const findUser = await this.model.findOne({ email: userData.email }).exec();
    if (!findUser) {
      throw new HttpException(409, `You're email ${userData.email} not found`);
    }
    const isPasswordMatching: boolean = await compare(userData.password, findUser.get('password', null, { getters: false }));
    if (!isPasswordMatching) {
      throw new HttpException(409, "You're password not matching");
    }
    const token = this.createToken(findUser);

    return { token, findUser };
  }

  public createToken(user: User): string {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn = '1h';

    return sign(dataStoredInToken, secret, { expiresIn });
  }
}
