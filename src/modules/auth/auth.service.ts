import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { SetEnvAsNumber } from '@Src/utils/env-variable.util';
import { LogInDto, RegisterDto } from '@Module/auth/dto/auth.dto';
import { UserService } from '@Module/user/user.service';
import { TokensService } from '@Module/auth/tokens.service';
import { SessionService } from '@Module/auth/session.service';

@Injectable()
export class AuthService {
  @SetEnvAsNumber('PASSWORD_SALT')
  private readonly passwordSalt: number;

  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly sessionService: SessionService,
  ) { }

  async register(data: RegisterDto) {
    const checkEmailExists = await this.userService.findFirst({
      where: {
        email: data.email,
      },
    });

    if (checkEmailExists) {
      throw new BadRequestException('User with specified email already exists');
    }

    const checkUsernameExists = await this.userService.findFirst({
      where: {
        username: data.username,
      },
    });

    if (checkUsernameExists) {
      throw new BadRequestException(
        'User with specified username already exists',
      );
    }

    const passwordHash = bcryptjs.hashSync(data.password, this.passwordSalt);

    await this.userService.create({
      data: {
        ...data,
        password: passwordHash,
      }
    });

    // TODO create list of basic expense categories
  }

  async logIn(data: LogInDto, deviceName: string) {
    const user = await this.userService.getExists({
      where: { email: data.email },
    });

    if (!bcryptjs.compareSync(data.password, user.password)) {
      throw new BadRequestException('Bad password');
    }

    const tokens = await this.tokensService.generatePairTokens({ id: user.id });

    await this.sessionService.create({
      data: {
        userId: user.id,
        deviceName,
        refreshToken: tokens.refreshToken,
      }
    });

    return tokens;
  }

  async logOut(refreshToken: string) {
    const candidate = await this.sessionService.getExists({
      where: {
        refreshToken,
      },
    });

    await this.sessionService.delete({
      where: {
        id: candidate.id,
      },
    })
  }

  async refresh(refreshToken: string) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new BadRequestException('Bad refresh token');
    }

    const decoded = await this.tokensService.verifyRefreshToken(refreshToken);

    const tokenCandidate = await this.sessionService.findFirst({
      where: {
        refreshToken,
      },
    });

    if (!tokenCandidate) {
      throw new BadRequestException('Refresh token not exists');
    }

    const tokens = await this.tokensService.generatePairTokens({
      id: decoded.id,
    });

    await this.sessionService.update({
      where: {
        id: tokenCandidate.id
      },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });

    return tokens;
  }

  async deleteSession() { }

  async updateSession() { }

  async changePassword() { }
}
