import request from 'supertest';
import App from '@/app';
import { IndexController } from '@/controllers';

describe('Testing Index', () => {
  afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
  });

  let indexController: IndexController;
  let app: App;

  beforeAll(async () => {
    indexController = new IndexController();
    app = new App([indexController]);
  });

  describe('[GET] /', () => {
    it('response statusCode 200', async () => {
      const { status, body } = await request(app.getServer()).get(`${indexController.path}`);
      expect(status).toBe(200);
      expect(body.message).toBeDefined();
    });
  });
});
