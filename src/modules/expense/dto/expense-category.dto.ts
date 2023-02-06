import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import Prisma from '@prisma/client';

export class CreateExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category label',
    example: 'Clothes',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;
}

export class UpdateExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category label',
    example: 'Food',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;
}

export class ExpenseCategoryDto {
  @ApiProperty({
    description: 'Expense category label',
    example: 'Food',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @IsString()
  readonly label: string;
}

export class CreateTransactionDto
  implements Pick<Prisma.Transaction, 'label' | 'expenseCategoryId' | 'amount'>
{
  @ApiProperty({
    description: 'Transaction date, by default `now`',
    example: '2023-02-03T17:09:38.384Z',
    type: 'string',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'fb3db38e-0c04-463f-a27b-77127790bdca',
    type: 'string',
  })
  @IsUUID()
  readonly expenseCategoryId: string;

  @ApiProperty({
    description: 'Transaction label',
    example: 'MacBook Air 2022',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly label: string;

  @ApiProperty({
    description: 'Transactions amount',
    example: 100,
    type: 'number',
  })
  @IsNumber()
  readonly amount: number;
}

export class UpdateTransactionDto
  implements
    Partial<Pick<Prisma.Transaction, 'label' | 'expenseCategoryId' | 'amount'>>
{
  @ApiProperty({
    description: 'Transaction date, by default `now`',
    example: '2023-02-03T17:09:38.384Z',
    type: 'string',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({
    description: 'Expense category ID',
    example: 'fb3db38e-0c04-463f-a27b-77127790bdca',
    type: 'string',
  })
  @IsUUID()
  @IsOptional()
  readonly expenseCategoryId: string;

  @ApiProperty({
    description: 'Transaction label',
    example: 'MacBook Air 2022',
    type: 'string',
    minLength: 1,
    maxLength: 30,
  })
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  readonly label: string;

  @ApiProperty({
    description: 'Transactions amount',
    example: 100,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  readonly amount: number;
}
