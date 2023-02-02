import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@Src/modules/auth/auth.module';
import { getEnv } from '@Src/utils/env-variable.util';

@Module({
  controllers: [],
  providers: [],
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: getEnv.string('DB_HOST'),
      port: getEnv.number('DB_PORT'),
      username: getEnv.string('DB_USERNAME'),
      password: getEnv.string('DB_PASSWORD'),
      database: getEnv.string('DB_NAME'),
      entities: [],
      synchronize: process.env.ENV !== 'prod' ? true : false,
    }),
    AuthModule,
  ],
})
export class AppModule {}
