import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtProtectedRequest } from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import {
  CreateExpenseCategoryDto,
  CreateTransactionDto,
  UpdateExpenseCategoryDto,
  UpdateTransactionDto,
} from '@Module/expense/dto/expense-category.dto';
import { ExpenseService } from '@Module/expense/expense.service';

@ApiTags('Expenses')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  async createTransaction(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateTransactionDto,
  ) {
    return this.expenseService.createTransaction(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction')
  async getTransactions(@Req() req: JwtProtectedRequest) {
    return this.expenseService.getTransactions(req.user.id);
  }

  @ApiParam({
    name: 'id',
    description: 'Transaction ID to update',
    type: 'string',
    example: '0f34aaaa-8194-4c90-902c-1155163cac76',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('transaction/:id')
  async updateTransaction(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    return this.expenseService.updateTransaction(req.user.id, id, body);
  }

  @ApiParam({
    name: 'id',
    description: 'Transaction ID to update',
    type: 'string',
    example: '0f34aaaa-8194-4c90-902c-1155163cac76',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('transaction/:id')
  async deleteTransaction(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteTransaction(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('category')
  async createCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateExpenseCategoryDto,
  ) {
    return this.expenseService.createExpenseCategory(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category')
  async getCategories(@Req() req: JwtProtectedRequest) {
    return this.expenseService.getExpenseCategories(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('category/:id')
  async updateCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: UpdateExpenseCategoryDto,
    @Param('id') id: string,
  ) {
    return this.expenseService.updateExpenseCategory(req.user.id, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('category/:id')
  async deleteCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteExpenseCategory(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('base-category')
  async createBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Body() body: CreateExpenseCategoryDto,
  ) {
    return this.expenseService.createBaseExpenseCategory(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('base-category')
  async getBaseCategories() {
    return this.expenseService.getBaseCategories();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('base-category/:id')
  async updateBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
    @Body() body: UpdateExpenseCategoryDto,
  ) {
    return this.expenseService.updateBaseCategory(req.user.id, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('base-category/:id')
  async deleteBaseCategory(
    @Req() req: JwtProtectedRequest,
    @Param('id') id: string,
  ) {
    await this.expenseService.deleteBaseCategory(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ballance')
  async getBallance(@Req() req: JwtProtectedRequest) {
    const ballance = await this.expenseService.getBallance(req.user.id);

    return {
      ballance,
    };
  }
}
