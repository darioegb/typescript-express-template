import request from 'supertest';
import App from '../app';
import { UserController } from '../controllers';
import { AuthService } from '../services';
import { DBHandler } from '../database/dbHandler';
import { Page } from '../interfaces';
import { UserDto } from '../dtos';
import { Roles } from '../enums';
import { Collection, Connection, Types } from 'mongoose';
import { hash } from 'bcryptjs';

describe('Testing Users', () => {
  let app: App;
  let dbHandler: DBHandler;
  let db: Connection;
  let userCollection: Collection;
  let userController: UserController;
  let token: string;
  let loginUserId: string;
  const loginUser: any = {
    email: 'user@test.com',
    password: 'admin',
    firstName: 'Login',
    lastName: 'User',
    role: Roles.Admin,
  };

  beforeAll(async () => {
    dbHandler = new DBHandler();
    userController = new UserController();
    app = new App([userController]);
    await dbHandler.connect();
    db = dbHandler.db;
    userCollection = db.collection('users');
    const authService = new AuthService();
    loginUser.password = await hash(loginUser.password, 10);
    loginUserId = await (await userCollection.insertOne(loginUser)).insertedId;
    token = authService.createToken(loginUser);
  });

  beforeEach(async () => {
    if (await userCollection.countDocuments()) {
      await userCollection.deleteMany({ _id: { $ne: loginUserId } });
    }
  });

  afterAll(async () => {
    await dbHandler.close();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const { status, body } = await request(app.getServer())
        .get(`${userController.path}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.items).toHaveLength(1);
    });

    it('should return a list of users filtered', async () => {
      const { status, body } = await request(app.getServer())
        .get(
          `${userController.path}?page=1&size=3&sort=email,desc&filter=firstName lastName email`
        )
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.items).toHaveLength(1);
      const firstUser = body.data.items[0];
      expect(firstUser).toHaveProperty('firstName');
      expect(firstUser).toHaveProperty('lastName');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).not.toHaveProperty('role');
    });

    it('should return an empty array when there are no users', async () => {
      const mockUserPage: Page<UserDto> = {
        items: [],
        number: 1,
        size: 10,
        totalItems: 0,
        totalPages: 1,
      };
      userController.userService.findEntityByPage = jest
        .fn()
        .mockReturnValueOnce(mockUserPage);

      const { status, body } = await request(app.getServer())
        .get(`${userController.path}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data.items).toHaveLength(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should return an error while the user does not exist', async () => {
      const { status, error } = await request(app.getServer())
        .get(`${userController.path}/${Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(409);
      expect(error && error.text).toMatch("You're not user");
    });
    it('should return a user', async () => {
      const { status, body } = await request(app.getServer())
        .get(`${userController.path}/${loginUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.email).toBe(loginUser.email);
    });
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'secret',
        firstName: 'Test',
        lastName: 'User',
        role: Roles.User,
      };

      const { status, body } = await request(app.getServer())
        .post(`${userController.path}`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockUser);

      expect(status).toBe(201);
      expect(body.data).toBeDefined();
      expect(body.data.email).toBe(mockUser.email);
    });

    it('should create a list of users', async () => {
      const mockUsers = [
        {
          email: 'user1@gmail.com',
          password: 'secret',
          firstName: 'Test 1',
          lastName: 'User',
          role: Roles.User,
        },
        {
          email: 'user2@gmail.com',
          password: 'secret',
          firstName: 'Test 2',
          lastName: 'User',
          role: Roles.User,
        },
      ];

      const { status, body } = await request(app.getServer())
        .post(`${userController.path}`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockUsers);

      expect(status).toBe(201);
      expect(body.data).toBeDefined();
      expect(body.data).toHaveLength(2);
    });

    it('should return an error while a user attribute missing', async () => {
      const mockUser = {
        email: 'user@gmail.com',
        password: 'secret',
        lastName: 'User',
        role: Roles.User,
      };

      const { status, error } = await request(app.getServer())
        .post(`${userController.path}`)
        .set('Authorization', `Bearer ${token}`)
        .send(mockUser);

      expect(status).toBe(400);
      expect(error && error.text && JSON.parse(error.text).message).toContain(
        'firstName should not be empty'
      );
    });
  });

  describe('UPDATE /users/:id', () => {
    it('should return an error while the user does not exist', async () => {
      const { status, error } = await request(app.getServer())
        .put(`${userController.path}/${Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Test 1' });

      expect(status).toBe(404);
      expect(error && error.text && JSON.parse(error.text).message).toContain(
        "You're user with id"
      );
    });
    it('should return error while user isNotAdminOrSameUser', async () => {
      const mockUser: any = {
        email: 'test@test.com',
        password: 'secret',
        firstName: 'Test',
        lastName: 'User',
        role: Roles.User,
      };
      mockUser.password = await hash(mockUser.password, 10);
      const authService = new AuthService();
      await userCollection.insertOne(mockUser);
      const token = authService.createToken(mockUser);
      const editUser = await userController.userService.findEntityById(
        loginUserId
      );
      editUser.firstName = 'Login Updated';
      const { status, error } = await request(app.getServer())
        .put(`${userController.path}/${loginUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editUser);

      expect(status).toBe(403);
      expect(error && error.text && JSON.parse(error.text).message).toContain(
        'You have no privilege to do that'
      );
    });
    it('should update a user', async () => {
      const editUser = await userController.userService.findEntityById(
        loginUserId
      );
      editUser.firstName = 'Login Updated';
      const { status, body } = await request(app.getServer())
        .put(`${userController.path}/${loginUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(editUser);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.firstName).toBe(editUser.firstName);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return an error while the user does not exist', async () => {
      const { status, error } = await request(app.getServer())
        .delete(`${userController.path}/${Types.ObjectId()}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(409);
      expect(error && error.text && JSON.parse(error.text).message).toMatch(
        "You're entity doesn't exist"
      );
    });
    it('should return error while user isNotAdmin', async () => {
      const mockUser: any = {
        email: 'test@test.com',
        password: 'secret',
        firstName: 'Test',
        lastName: 'User',
        role: Roles.User,
      };
      mockUser.password = await hash(mockUser.password, 10);
      const authService = new AuthService();
      await userCollection.insertOne(mockUser);
      const token = authService.createToken(mockUser);
      const { status, error } = await request(app.getServer())
        .delete(`${userController.path}/${loginUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(403);
      expect(error && error.text && JSON.parse(error.text).message).toContain(
        'You have no privilege to do that'
      );
    });
    it('should delete a user', async () => {
      const { status, body } = await request(app.getServer())
        .delete(`${userController.path}/${loginUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.email).toBe(loginUser.email);
    });
  });
});
