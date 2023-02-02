import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { JwtTokensPair } from '@Module/auth/tokens.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ChangePasswordDto,
  LogInDto,
  RegisterDto,
  UpdateSessionDto,
} from '@Src/modules/auth/dto/auth.dto';
import { GetCookies } from '@Src/utils/get-cookies.decorator';
import { Response } from 'express';

@ApiTags('Authentication / authorization')
@UsePipes(ZodValidationPipe)
@Controller('auth')
export class AuthController {
  constructor() { }

  @Post('register')
  async register(@Res() res: Response, @Body() body: RegisterDto) {
    res.send({ status: 'ok' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Body() body: LogInDto) { }

  @Get('logout')
  async logOut(@GetCookies('refreshToken') refreshToken: string) { }

  @Get('refresh')
  async refresh(@GetCookies('refreshToken') refreshToken: string) { }

  @Delete('session/:id')
  async deleteSession(@Param('id', ParseUUIDPipe) id: string) { }

  @Patch('sessions/:id')
  async updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSessionDto,
  ) { }

  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordDto) { }

  private async setCookies(
    res: Response,
    { accessToken, refreshToken }: JwtTokensPair,
    responseCode = 201,
  ) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: true,
    });

    res.send({ accessToken }).status(responseCode);
  }
}
