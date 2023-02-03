import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import Prisma from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import type { Application } from 'express';
import * as request from 'supertest';

import { AppModule } from '@Src/app.module';
import { createAdmin } from '@Src/utils/admin.util';
import { createBaseExpenseCategories } from '@Src/utils/base-expense-categories.util';
import { clearDatabase } from '@Test/utils/clear-database';
import { UserActions } from '@Test/utils/user-actions';

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

    await createBaseExpenseCategories();
    await createAdmin();
  });

  afterAll(async () => {
    await application.close();
    await clearDatabase();
  });

  it('check if expense categories are created after user registration', async () => {
    expect(await prisma.baseExpenseCategory.findMany()).toHaveLength(7);
  });

  describe('Entire auth logic cycle', () => {
    let user: UserActions;

    it('check if expense categories are created after user registration', async () => {
      expect(await prisma.expenseCategory.findMany()).toHaveLength(0);

      user = new UserActions(app);

      await user.register();

      expect(await prisma.expenseCategory.findMany()).toHaveLength(7);
    });

    let expenseCategory: Prisma.ExpenseCategory;

    it('create new expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'post',
        send: {
          label: 'NewLabel',
        },
        expect: 201,
      });

      expenseCategory = await prisma.expenseCategory.findFirst({
        where: {
          label: body.label,
        },
      });

      expect(expenseCategory.label).toBeDefined();
    });

    it('update expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category/' + expenseCategory.id,
        method: 'patch',
        send: {
          label: 'NewLabel2',
        },
        expect: 200,
      });

      const categoryFromDb = await prisma.expenseCategory.findFirst({
        where: {
          id: expenseCategory.id,
        },
      });

      expect(body.label).toBe('NewLabel2');
      expect(categoryFromDb.label).toBe('NewLabel2');
    });

    it('delete expense category', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'post',
        send: {
          label: 'NewLabel12',
        },
        expect: 201,
      });

      await user.request({
        url: '/expense/category/' + body.id,
        method: 'delete',
        expect: 200,
      });

      expect(
        await prisma.expenseCategory.findFirst({ where: { id: body.id } }),
      ).toBeNull();
    });

    it('fetch expense categories', async () => {
      const { body } = await user.request({
        url: '/expense/category',
        method: 'get',
        expect: 200,
      });

      expect(body).toHaveLength(8);
    });

    let admin: UserActions;
    let baseExpenseCategory: Prisma.BaseExpenseCategory;

    it('fetch base expense categories', async () => {
      const { body } = await user.request({
        url: '/expense/base-category',
        method: 'get',
        expect: 200,
      });

      expect(body).toHaveLength(7);
    });

    it('create new base expense category', async () => {
      admin = new UserActions(app, {
        email: 'admin@gmail.com',
        username: 'Admin',
        password: '1234',
      });

      await admin.logIn();

      const { body } = await admin.request({
        url: '/expense/base-category',
        method: 'post',
        send: {
          label: 'SomeThing',
        },
        expect: 201,
      });

      baseExpenseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          label: 'SomeThing',
        },
      });

      expect(body.label).toBe('SomeThing');
      expect(baseExpenseCategory).not.toBeNull();
    });

    it('update base expense category', async () => {
      const { body } = await admin.request({
        url: '/expense/base-category/' + baseExpenseCategory.id,
        method: 'patch',
        send: {
          label: 'SomeThingNew',
        },
        expect: 200,
      });

      const updatedBaseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          id: baseExpenseCategory.id,
        },
      });

      expect(body.label).toBe('SomeThingNew');
      expect(updatedBaseCategory.label).toBe('SomeThingNew');
    });

    it('delete base expense category', async () => {
      const { body } = await admin.request({
        url: '/expense/base-category/' + baseExpenseCategory.id,
        method: 'delete',
        expect: 200,
      });

      const updatedBaseCategory = await prisma.baseExpenseCategory.findFirst({
        where: {
          id: baseExpenseCategory.id,
        },
      });

      expect(updatedBaseCategory).toBeUndefined;
    });
  });
});
