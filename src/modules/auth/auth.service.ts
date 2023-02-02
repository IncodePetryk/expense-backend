import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { SetEnvAsNumber } from 'src/utils/env-variable.util';

@Injectable()
export class AuthService {
  @SetEnvAsNumber('PASSWORD_SALT')
  private readonly passwordSalt: number;

  constructor() { }

  async register() { }

  async logIn() { }

  async logOut() { }

  async refresh() { }

  async deleteSession() { }

  async deleteAllSessions() { }

  async updateSession() { }

  async changePassword() { }
}
