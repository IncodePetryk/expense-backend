import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '@Src/modules/user/user.service';

@Module({
  providers: [UserService],
  controllers: [],
  imports: [
    // TypeOrmModule.forFeature([]),
  ],
  exports: [UserService],
})
export class UserModule {}
