import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
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
