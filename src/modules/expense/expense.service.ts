import { BadRequestException, Injectable } from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';
import {
  UpdateExpenseCategoryDto,
  CreateExpenseCategoryDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@Module/expense/dto/expense-category.dto';
import { UserService } from '@Module/user/user.service';
import { BaseExpenseCategoryService } from '@Module/expense/base-expense-category.service';
import { TransactionService } from '@Module/expense/transaction.service';
import { ExpenseCategoryService } from '@Module/expense/expense-category.service';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly userService: UserService,
    private readonly baseExpenseCategoryService: BaseExpenseCategoryService,
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly transactionService: TransactionService,
  ) { }

  async createTransaction(userId: string, data: CreateTransactionDto) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const expenseCategoryCandidate =
      await this.expenseCategoryService.findFirst({
        where: {
          id: data.expenseCategoryId,
        },
      });

    this.expenseCategoryService.checkIfCategoryBelongsToUser(
      userCandidate,
      expenseCategoryCandidate,
    );

    return this.transactionService.create({
      data: {
        ...data,
        date: data.date || new Date(),
        userId: userCandidate.id,
        expenseCategoryId: expenseCategoryCandidate.id,
      },
    });
  }

  async getTransactions(userId: string) {
    return this.transactionService.findMany({
      where: {
        userId,
      },
    });
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDto,
  ) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const expenseCategoryCandidate =
      await this.expenseCategoryService.findFirst({
        where: {
          id: data.expenseCategoryId,
        },
      });

    const transactionCandidate = await this.transactionService.getExisting({
      where: {
        id: transactionId,
      },
    });

    return this.transactionService.update({
      where: {
        id: transactionCandidate.id,
      },
      data: {
        ...data,
        userId: userCandidate.id,
        expenseCategoryId: expenseCategoryCandidate.id,
      },
    });
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const transactionCandidate = await this.transactionService.getExisting({
      where: {
        id: transactionId,
      },
    });

    this.transactionService.checkIfTransactionBelongsToUser(
      userCandidate,
      transactionCandidate,
    );

    await this.transactionService.delete({
      where: {
        id: transactionCandidate.id,
      },
    });
  }

  async createExpenseCategory(userId: string, data: CreateExpenseCategoryDto) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const checkCategoryExists = await prisma.expenseCategory.findFirst({
      where: {
        userId,
        label: data.label,
      },
    });

    if (checkCategoryExists) {
      throw new BadRequestException(
        'Expense category with this label already exists',
      );
    }

    return prisma.expenseCategory.create({
      data: {
        userId: userCandidate.id,
        label: data.label,
      },
      select: {
        id: true,
        label: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getExpenseCategories(userId: string) {
    return this.expenseCategoryService.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        label: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateExpenseCategory(
    userId: string,
    categoryId: string,
    data: UpdateExpenseCategoryDto,
  ) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const categoryCandidate = await this.expenseCategoryService.getExisting({
      where: {
        id: categoryId,
      },
    });

    this.expenseCategoryService.checkIfCategoryBelongsToUser(
      userCandidate,
      categoryCandidate,
    );

    return prisma.expenseCategory.update({
      where: {
        id: categoryCandidate.id,
      },
      data: {
        label: data.label,
      },
    });
  }

  async deleteExpenseCategory(userId: string, categoryId: string) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    const categoryCandidate = await this.expenseCategoryService.getExisting({
      where: {
        id: categoryId,
      },
    });

    this.expenseCategoryService.checkIfCategoryBelongsToUser(
      userCandidate,
      categoryCandidate,
    );

    await prisma.expenseCategory.delete({
      where: {
        id: categoryCandidate.id,
      },
    });
  }

  async getBaseCategories() {
    return this.baseExpenseCategoryService.findMany({
      select: {
        id: true,
        label: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createBaseExpenseCategory(
    userId: string,
    data: CreateExpenseCategoryDto,
  ) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    if (userCandidate.role !== 'admin') {
      throw new BadRequestException('User is not admin');
    }

    const categoryCandidate = await this.baseExpenseCategoryService.findFirst({
      where: {
        label: data.label,
      },
    });

    if (categoryCandidate) {
      throw new BadRequestException(
        'Expense category with this label already exists',
      );
    }

    return this.baseExpenseCategoryService.create({
      data: {
        label: data.label,
      },
    });
  }

  async updateBaseCategory(
    userId: string,
    categoryId: string,
    data: UpdateExpenseCategoryDto,
  ) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    if (userCandidate.role !== 'admin') {
      throw new BadRequestException('User is not admin');
    }

    const categoryCandidate = await this.baseExpenseCategoryService.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!categoryCandidate) {
      throw new BadRequestException('Base category not exists');
    }

    return this.baseExpenseCategoryService.update({
      where: {
        id: categoryId,
      },
      data: {
        label: data.label,
      },
    });
  }

  async deleteBaseCategory(userId: string, categoryId: string) {
    const userCandidate = await this.userService.getExists({
      where: {
        id: userId,
      },
    });

    if (userCandidate.role !== 'admin') {
      throw new BadRequestException('User is not admin');
    }

    const categoryCandidate = await this.baseExpenseCategoryService.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!categoryCandidate) {
      throw new BadRequestException('Base category not exists');
    }

    this.baseExpenseCategoryService.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
