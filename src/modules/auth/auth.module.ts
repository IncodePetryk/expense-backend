import { Module } from '@nestjs/common';

import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [],
  exports: [AuthService],
})
export class AuthModule {}
