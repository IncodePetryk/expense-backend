import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@Module/auth/auth.service';
import { JwtTokensPair } from '@Module/auth/tokens.service';
import {
  ChangePasswordDto,
  LogInDto,
  RegisterDto,
  UpdateSessionDto,
} from '@Src/modules/auth/dto/auth.dto';
import { DeviceName } from '@Src/utils/device-name.decorator';
import { GetCookies } from '@Src/utils/get-cookies.decorator';

@ApiTags('Authentication / authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Get('login')
  async logIn(
    @Res() res: Response,
    @Body() body: LogInDto,
    @DeviceName() deviceName: string,
  ) {
    const tokens = await this.authService.logIn(body, deviceName);

    this.setCookies(res, tokens);
  }

  @Get('logout')
  async logOut(@GetCookies('refreshToken') refreshToken: string) {
    await this.authService.logOut(refreshToken);
  }

  @Get('refresh')
  async refresh(
    @Res() res: Response,
    @GetCookies('refreshToken') refreshToken: string,
  ) {
    const tokens = await this.authService.refresh(refreshToken);

    this.setCookies(res, tokens);
  }

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
    responseCode = 200,
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
