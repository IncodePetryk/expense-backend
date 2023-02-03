import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

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

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Expense category ID',
    example: 'fb3db38e-0c04-463f-a27b-77127790bdca',
    type: 'string',
  })
  @IsUUID()
  @IsString()
  readonly categoryId: string;

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
