import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
