// Setup env variables before import other modules
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { Test, TestingModule } from '@nestjs/testing';
import type { Application } from 'express';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

import { AppModule } from '@Src/app.module';
import { UserActions } from '@Test/utils/user-actions';
import getCookies from '@Test/utils/get-cookies';

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
      .init();

    app = application.getHttpServer();
  });

  afterAll(async () => {
    await application.close();
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
      await request(app)
        .post('/auth/register')
        .send(user)
        .expect(201);

      // TODO Check if created new user in database
    });

    it('log-in user', async () => {
      const { body } = await request(app)
        .post('/auth/login')
        .send(user)
        .expect(200);

      const cookies = getCookies(body);

      expect(cookies.accessToken).toBeDefined();
      expect(cookies.refreshToken).toBeDefined();

      user.refreshToken = cookies.refreshToken.value;
      user.accessToken = body.accessToken;

      // TODO check if refresh token from cookies is equal to refresh token in database
    });

    it('refresh token', async () => {
      const { body } = await request(app)
        .get('/auth/refresh')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200)

      const cookies = getCookies(body);

      expect(cookies.accessToken).toBeDefined();
      expect(cookies.refreshToken).toBeDefined();

      expect(cookies.refreshToken.value).not.toBe(user.refreshToken);

      // TODO check if refresh token in database has been changes to the new

      user.refreshToken = cookies.refreshToken.value
    });

    it('log-out user', async () => {
      await request(app)
        .get('/auth/logout')
        .set({ Authorization: 'Bearer ' + user.accessToken })
        .expect(200);

      // TODO check if refresh token has been deleted
    });
  });
});
