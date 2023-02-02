import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokensService } from '@Module/auth/tokens.service';
import { AuthController } from '@Src/modules/auth/auth.controller';
import { AuthService } from '@Src/modules/auth/auth.service';
import { SessionService } from '@Src/modules/auth/session.service';
import { UserModule } from '@Src/modules/user/user.module';

@Module({
  providers: [AuthService, SessionService, TokensService, JwtService],
  controllers: [AuthController],
  imports: [UserModule],
  exports: [AuthService, SessionService, TokensService],
})
export class AuthModule { }
