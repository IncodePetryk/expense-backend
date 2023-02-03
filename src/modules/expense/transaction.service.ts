import { Injectable } from '@nestjs/common';
import Prisma from '@prisma/client';

import { prisma } from '@Src/shared/prisma';

@Injectable()
export class TransactionService {
  constructor() {}
}
