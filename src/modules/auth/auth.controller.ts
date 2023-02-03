import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '@Module/auth/auth.service';
import {
  JwtProtectedRequest,
  LocalProtectedRequest,
} from '@Module/auth/interfaces/protected-request.interface';
import { JwtAuthGuard } from '@Module/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@Module/auth/local-auth.guard';
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
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiBody({ type: LogInDto })
  @UseGuards(LocalAuthGuard)
  @Get('login')
  async logIn(
    @Req() req: LocalProtectedRequest,
    @Res() res: Response,
    @DeviceName() deviceName: string,
  ) {
    const tokens = await this.authService.logIn(req.user, deviceName);

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

  @UseGuards(JwtAuthGuard)
  @Get('session')
  async getSessions(@Req() req: JwtProtectedRequest) {
    return this.authService.getSessions(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('session/:id')
  async deleteSession(
    @Req() req: JwtProtectedRequest,
    @Param('id', ParseUUIDPipe) sessionId: string,
  ) {
    return this.authService.deleteSessionById(req.user.id, sessionId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('session/:id')
  async updateSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSessionDto,
  ) {
    return this.authService.updateSession(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: JwtProtectedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.authService.changePassword(req.user.id, body);
  }

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
