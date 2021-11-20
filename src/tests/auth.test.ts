import request from 'supertest';
import { Connection, Collection } from 'mongoose';
import { hashSync } from 'bcryptjs';
import App from '@/app';
import { DBHandler } from '@config';
import { AuthController } from '@controllers';
import { Roles } from '@enums';
import { User } from '@interfaces';

describe('Testing Auth', () => {
  let app: App;
  let dbHandler: DBHandler;
  let db: Connection;
  let userCollection: Collection;
  let authController: AuthController;

  const userData: User = {
    _id: undefined,
    email: 'userdata@test.com',
    password: 'secret',
    firstName: 'User',
    lastName: 'Data',
    fullName: 'Login User',
    role: Roles.User,
  };

  beforeAll(async () => {
    dbHandler = new DBHandler();
    authController = new AuthController();
    app = new App([authController]);
    db = dbHandler.db;
    userCollection = db.collection('users');
    userData.password = hashSync(userData.password, 10);
  });

  afterAll(async () => {
    await dbHandler.clear();
    await dbHandler.close();
  });

  describe('POST /signup', () => {
    it('response should have the Create userData', async () => {
      authController.userService.model.exists = jest.fn().mockReturnValueOnce(Promise.resolve(false));

      const { status, body } = await request(app.getServer()).post(`${authController.path}/signup`).send(userData);

      expect(status).toBe(201);
      expect(body.data).toBeDefined();
      expect(body.data.user.email).toBe(userData.email);
    });
  });

  describe('POST /login', () => {
    it('response should return error when loginUser is incorrect', async () => {
      const fakeUser = {
        email: 'fail@test.com',
        password: 'fake',
      };
      const { status, error } = await request(app.getServer()).post(`${authController.path}/login`).send(fakeUser);

      expect(status).toBe(409);
      expect(error && error.text).toMatch(`You're email ${fakeUser.email} not found`);
    });
    it('response should return error when password not matching', async () => {
      const { status, error } = await request(app.getServer())
        .post(`${authController.path}/login`)
        .send({ email: userData.email, password: '123456' });

      expect(status).toBe(409);
      expect(error && error.text).toMatch("You're password not matching");
    });
    it('response should have data with the Authorization token', async () => {
      const { status, body } = await request(app.getServer())
        .post(`${authController.path}/login`)
        .send({ email: userData.email, password: userData.password });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
    });
  });

  describe('GET /renew', () => {
    it('response should return error when token is incorrect', async () => {
      const { status, error } = await request(app.getServer()).get(`${authController.path}/renew`).set('Authorization', `Bearer `);

      expect(status).toBe(401);
      expect(error && error.text).toMatch('Wrong authentication token');
    });
    it('response should return error when userId is incorrect', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjc3OWYwMmNhMGJlNDU5MThhMDFhNDQifQ.8AkrfYiONfWJcdSTApVrkXOH9PaDSz09M22ZCT4Ukkc';
      const { status, error } = await request(app.getServer()).get(`${authController.path}/renew`).set('Authorization', `Bearer ${token}`);

      expect(status).toBe(401);
      expect(error && error.text).toMatch('Wrong authentication token');
    });
    it('response should return error when not set authorization header', async () => {
      const { status, error } = await request(app.getServer()).get(`${authController.path}/renew`);

      expect(status).toBe(404);
      expect(error && error.text).toMatch('Authentication token missing');
    });

    it('response should have data with the new Authorization token', async () => {
      const findUser = await userCollection.findOne({ email: userData.email });
      const token = authController.authService.createToken(findUser);

      const { status, body } = await request(app.getServer()).get(`${authController.path}/renew`).set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.user.email).toBe(userData.email);
    });
  });
});
