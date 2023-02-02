import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import * as request from 'supertest';

import { AppModule } from '@Src/app.module';
import { clearDatabase } from '@Test/clear-database';
import getCookies from '@Test/utils/get-cookies';
import { sleep } from '@Test/utils/sleep';

describe('AppController (e2e)', () => {
  let app: Application;
  let application: INestApplication;

  beforeAll(async () => {
    // Init express application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = await module
      .createNestApplication()
      .use(cookieParser())
      .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
      .init();

    app = application.getHttpServer();

    await clearDatabase();
  });

  afterAll(async () => {
    await application.close();
    await clearDatabase();
  });

  describe('Entire auth logic cycle', () => {
    const user = {
      email: 'some@email.com',
      username: 'guess',
      password: '123123123',
      accessToken: '',
      refreshToken: '',
    };

    it('register user', async () => {
      expect(await prisma.user.count()).toBe(0);
      await request(app).post('/auth/register').send(user).expect(201);

      expect(await prisma.user.count()).toBe(1);

      const userFromDb = await prisma.user.findFirst({ where: { email: user.email } });

      expect(userFromDb.username).toBe(user.username);
    });

    it('log-in user', async () => {
      expect(await prisma.session.count()).toBe(0);

      const r = await request(app).get('/auth/login').send(user).expect(200);

      const cookies = getCookies(r);

      expect(r.body.accessToken).toBeDefined();
      expect(cookies.refreshToken.value).toBeDefined();

      const sessions = await prisma.session.findMany();

      expect(sessions).toHaveLength(1);

      expect(sessions[0].refreshToken).not.toBe(user.refreshToken);

      user.refreshToken = cookies.refreshToken.value;
      user.accessToken = r.body.accessToken;
    });

    it('refresh token', async () => {
      await sleep(1000);
      const r = await request(app)
        .get('/auth/refresh')
        .set('Cookie', [`refreshToken=${user.refreshToken}`])
        .expect(200);

      const cookies = getCookies(r);

      expect(r.body.accessToken).toBeDefined();
      expect(cookies.refreshToken.value).toBeDefined();

      expect(cookies.refreshToken.value).not.toBe(user.refreshToken);

      user.refreshToken = cookies.refreshToken.value;

      expect((await prisma.session.findMany())[0].refreshToken).toBe(cookies.refreshToken.value);
    });

    it('log-out user', async () => {
      await request(app)
        .get('/auth/logout')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      expect(await prisma.session.count()).toBe(0);
    });
  });
});
