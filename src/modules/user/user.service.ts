import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() { }

  // @InjectRepository()
  // private usersRepository: Repository<>,

  async create() { }

  async findFirst() { }

  async findMany() { }

  async getExists() { }
}
