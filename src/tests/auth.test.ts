import request from 'supertest';
import { Connection, Collection } from 'mongoose';
import App from '../app';
import { AuthController } from '../controllers';
import { DBHandler } from '../database/dbHandler';
import { Roles } from '../enums';
import { hashSync } from 'bcryptjs';

describe('Testing Auth', () => {
  let app: App;
  let dbHandler: DBHandler;
  let db: Connection;
  let userCollection: Collection;
  let authController: AuthController;
  const userData: any = {
    email: 'userdata@test.com',
    password: 'secret',
    firstName: 'User',
    lastName: 'Data',
    role: Roles.User,
  };

  beforeAll(async () => {
    dbHandler = new DBHandler();
    authController = new AuthController();
    app = new App([authController]);
    await dbHandler.connect();
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
      authController.userService.model.exists = jest
        .fn()
        .mockReturnValueOnce(Promise.resolve(false));

      const { status, body } = await request(app.getServer())
        .post(`${authController.path}/signup`)
        .send(userData);

      expect(status).toBe(201);
      expect(body.data).toBeDefined();
      expect(body.data.user.email).toBe(userData.email);
    });
  });

  describe('POST /login', () => {
    it('response should have data with the Authorization token', async () => {
      const { status, body } = await request(app.getServer())
        .post(`${authController.path}/login`)
        .send({ email: userData.email, password: userData.password });

      expect(status).toBe(200);
      expect(body.data.token).toBeDefined();
    });
  });

  describe('GET /renew', () => {
    it('response should have data with the new Authorization token', async () => {
      const findUser = await userCollection.findOne({ email: userData.email });
      const token = authController.authService.createToken(findUser);
  
      const { status, body } = await request(app.getServer())
        .get(`${authController.path}/renew`).set('Authorization', `Bearer ${token}`);
  
      expect(status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.user.email).toBe(userData.email);
    });
   });

});
