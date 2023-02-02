import { Module } from '@nestjs/common';

import { AuthController } from '@Src/modules/auth/auth.controller';
import { AuthService } from '@Src/modules/auth/auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [],
  exports: [AuthService],
})
export class AuthModule {}
